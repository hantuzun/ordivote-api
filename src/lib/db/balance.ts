import { getDatabase } from './connection'
import * as schema from '@/drizzle/schema'
import { and, desc, eq, lte } from 'drizzle-orm'
import { getBlockEvents } from '../api/okx'
import { balanceMapFromOKXOrdNodeEvents, isBlockIncluded, syncDBUntilBlockHeight } from '../helpers'

const MAXIMUM_INSERT_RECORDS = 1000

export async function getBalancesAtBlockHeightWithTicker(ticker: string, blockHeight: number) {
  const isBlockIncludedInDB = await isBlockIncluded(blockHeight)
  if (!isBlockIncludedInDB) {
    await syncDBUntilBlockHeight(blockHeight)
  }
  let records = await getDatabase()
    .select()
    .from(schema.balance)
    .where(and(eq(schema.balance.ticker, ticker), lte(schema.balance.blockHeight, blockHeight)))
    .orderBy(desc(schema.balance.blockHeight))

  let visitedAddressesMap = new Map<string, boolean>()
  let filteredRecords = []
  for (let record of records) {
    if (!visitedAddressesMap.has(record.address)) {
      visitedAddressesMap.set(record.address, true)
      filteredRecords.push(record)
    }
  }

  return filteredRecords.map((record) => ({
    address: record.address,
    amount: record.amount,
  }))
}

export async function getCurrentBalanceWithTickerAndAddress(ticker: string, address: string) {
  let records = await getDatabase()
    .select()
    .from(schema.balance)
    .where(and(eq(schema.balance.ticker, ticker), eq(schema.balance.address, address)))
    .orderBy(desc(schema.balance.blockHeight))
    .limit(1)
  if (records.length === 0) {
    return null
  }
  return { address: records[0].address, amount: records[0].amount, ticker: records[0].ticker }
}

export async function getBalanceAtBlockHeightWithTickerAndAddress(ticker: string, address: string, blockHeight: number) {
  let records = await getDatabase()
    .select()
    .from(schema.balance)
    .where(
      and(
        eq(schema.balance.ticker, ticker),
        and(eq(schema.balance.address, address), lte(schema.balance.blockHeight, blockHeight))
      )
    )
    .orderBy(desc(schema.balance.blockHeight))
    .limit(1)
  if (records.length === 0) {
    return null
  }
  return { address: records[0].address, amount: records[0].amount, ticker: records[0].ticker }
}

export async function insertNewBalance(ticker: string, address: string, amount: number, blockHeight: number) {
  await getDatabase().insert(schema.balance).values({ ticker, address, amount, blockHeight }).execute()
}

export async function bulkInsertNewBalance(balances: { ticker: string; address: string; amount: number }[], blockHeight: number) {
  let values = balances.map((balance) => ({
    ticker: balance.ticker,
    address: balance.address,
    amount: balance.amount,
    blockHeight: blockHeight,
  }))

  let valueChunks = []
  for (let i = 0; i < values.length; i += MAXIMUM_INSERT_RECORDS) {
    valueChunks.push(values.slice(i, i + MAXIMUM_INSERT_RECORDS))
  }
  await Promise.all(valueChunks.map((valueChunk) => getDatabase().insert(schema.balance).values(valueChunk).execute()))
}

export async function updateBalances(blockHeight: number) {
  const blockEventsResponse = await getBlockEvents(blockHeight)
  const eventMap = balanceMapFromOKXOrdNodeEvents(blockEventsResponse.data.events)
  let oldBalanceQueries: any[] = []
  let oldBalanceQueryInfo: any[] = []
  Object.keys(eventMap).forEach((address) => {
    Object.keys(eventMap[address]).forEach((ticker) => {
      oldBalanceQueries.push(getBalanceAtBlockHeightWithTickerAndAddress(ticker, address, blockHeight))
      oldBalanceQueryInfo.push({ ticker, address })
    })
  })
  const oldBalances = await Promise.all(oldBalanceQueries)

  let newBalances: { ticker: string; address: string; amount: number }[] = []
  oldBalances.forEach((oldBalance, index) => {
    if (oldBalance === null) {
      newBalances.push({
        ticker: oldBalanceQueryInfo[index].ticker,
        address: oldBalanceQueryInfo[index].address,
        amount: eventMap[oldBalanceQueryInfo[index].address][oldBalanceQueryInfo[index].ticker],
      })
    } else {
      newBalances.push({
        ticker: oldBalance.ticker,
        address: oldBalance.address,
        amount: oldBalance.amount + eventMap[oldBalance.address][oldBalance.ticker],
      })
    }
  })
  await bulkInsertNewBalance(newBalances, blockHeight)
}
