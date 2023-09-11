import { mysqlTable, int, varchar, index, serial, bigint } from 'drizzle-orm/mysql-core'

const MAX_INT = 2147483647

// blocks will be used to store which blocks were already included in the database
export const block = mysqlTable(
  'block',
  {
    hash: varchar('id', { length: 64 }).primaryKey(),
    height: int('height').notNull(),
  },
  (table) => ({
    blockHashIndex: index('block_hash_index').on(table.hash),
    blockHeightIndex: index('block_height_index').on(table.height),
  })
)

// the total row count will be same as the number of events returned from the OKX API
export const balance = mysqlTable(
  'balance',
  {
    id: serial('id').primaryKey(),
    address: varchar('address', { length: 255 }).notNull(),
    amount: bigint('amount', { mode: 'number' }).notNull(),
    ticker: varchar('ticker', { length: 255 }).notNull(),
    blockHeight: int('block_height').notNull(), // last block height when the balance was updated
  },
  (table) => ({
    addressIndex: index('address_index').on(table.address),
    blockHeightIndex: index('block_height_index').on(table.blockHeight),
  })
)

export const globals = mysqlTable(
  'globals',
  {
    id: serial('id').primaryKey(),
    minimumNotMinedRequestedBlockHeight: int('minimumNotMinedRequestedBlockHeight').default(MAX_INT).notNull(),
  },
  (table) => ({})
)
