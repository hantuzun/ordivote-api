import mempoolJS from '@mempool/mempool.js'

const {
  bitcoin: { blocks },
} = mempoolJS({
  hostname: 'mempool.space',
})

export async function getBlockHash(height: number) {
  const res = await blocks.getBlockHeight({ height }) // it returns the hash of the block with requested height (name of the function is misleading)
  return res
}

export async function getBlockHeight(hash: string) {
  const res = await blocks.getBlock({ hash })
  return res.height
}
