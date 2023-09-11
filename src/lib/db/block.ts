import { getDatabase } from './connection'
import * as schema from '@/drizzle/schema'
import { desc, eq } from 'drizzle-orm'
import { getBlockHash, getBlockHeight } from '@/lib/api/mempool'

export const getBlockByHash = async (hash: string) => {
  let records = await getDatabase().select().from(schema.block).where(eq(schema.block.hash, hash))
  return records[0]
}

export const getBlockByHeight = async (height: number) => {
  let records = await getDatabase().select().from(schema.block).where(eq(schema.block.height, height))
  return records[0]
}

export const getLatestBlock = async () => {
  let records = await getDatabase().select().from(schema.block).orderBy(desc(schema.block.height)).limit(1)
  return records[0]
}

export const insertBlock = async (hash: string, height: number) => {
  await getDatabase().insert(schema.block).values({ hash, height }).execute()
}

export const insertBlockByHeight = async (height: number) => {
  let hash = await getBlockHash(height)
  await insertBlock(hash, height)
}

export const insertBlockByHash = async (hash: string) => {
  let height = await getBlockHeight(hash)
  await insertBlock(hash, height)
}
