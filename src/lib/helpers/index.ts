import { getBlockHash } from '../api/mempool'
import { updateBalances } from '../db/balance'
import { getLatestBlock, insertBlock } from '../db/block'

export function balanceMapFromOKXOrdNodeEvents(events: OKXOrdNodeBlockEvent[]) {
  const balanceMap: {
    [key: string]: { [key: string]: number }
  } = {}
  events.forEach((event) => {
    if (event.from.address && !balanceMap[event.from.address]) {
      balanceMap[event.from.address] = {}
    }
    if (!balanceMap[event.to.address]) {
      balanceMap[event.to.address] = {}
    }
  })
  events.forEach((event) => {
    if (event.type === 'mint' && event.valid) {
      if (!balanceMap[event.to.address][event.tick]) {
        balanceMap[event.to.address][event.tick] = 0
      }
      balanceMap[event.to.address][event.tick] += event.amount
    } else if (event.valid) {
      if (!balanceMap[event.from.address!][event.tick]) {
        balanceMap[event.from.address!][event.tick] = 0
      }
      if (!balanceMap[event.to.address][event.tick]) {
        balanceMap[event.to.address][event.tick] = 0
      }
      balanceMap[event.from.address!][event.tick] -= event.amount
      balanceMap[event.to.address][event.tick] += event.amount
    }
  })
  return balanceMap
}

export async function syncDBUntilBlockHeight(height: number) {
  let latestSyncedBlock = await getLatestBlock()
  if (!latestSyncedBlock) {
    latestSyncedBlock = {
      hash: '',
      height: 0,
    }
  }
  while (latestSyncedBlock.height < height) {
    latestSyncedBlock.height += 1
    latestSyncedBlock.hash = await getBlockHash(latestSyncedBlock.height)
    if (latestSyncedBlock.hash === 'Block not found') {
      return
    }
    await updateBalances(latestSyncedBlock.height)
    await insertBlock(latestSyncedBlock.hash, latestSyncedBlock.height)
  }
}

export async function isBlockIncluded(height: number) {
  let latestBlock = await getLatestBlock()
  if (!latestBlock) {
    return false
  }
  return height <= latestBlock.height
}
