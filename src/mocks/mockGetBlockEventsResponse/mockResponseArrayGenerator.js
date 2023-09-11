const crypto = require('crypto')
const fs = require('fs')

const tickers = ['ordi', 'pepe', 'meme', 'tid', 'test']
const tickerOwners = {
  ordi: 'bc1prlfvpa4dxxqxz3pmn3aa0zyja50067qvemyng37c9p5yyuht3e8sp2s8ge',
  pepe: 'bc1pjyslelnlyep45sjx8kc5u34qdeceq6uwsdsuhtqme4egksprk5kqsvm2fj',
  meme: 'bc1pjyslelnlyep45sjx8kc5u34qdeceq6uwsdsuhtqme4egksprk5kqsvm2fj',
  tid: 'bc1qj2x0d7c588g7k65lr8pmeu2qhcevwhmp7rqe4v',
  test: 'bc1pfxj09g6n8l2cevghgyvhrp5reyeyg7a7m8e5f29h7dtn95ggurzsw0a9c5',
}

const txTypes = ['mint', 'transfer']

const addresses = [
  '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
  '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
  'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  'BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4',
  'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7',
  'bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7k7grplx',
  'BC1SW50QA3JX3S',
  'bc1zw508d6qejxtdg4y5r3zarvaryvg6kdaj',
  'bc1qqqqqp399et2xygdj5xreqhjjvcmzhxw4aywxecjdzew6hylgvsesrxh6hy',
  'bc1p2344tp4n8c47jpuekprrxdztt4v0u79ghqwtgn9y9k4u3kwex7nqt866up',
]

const blockHeights = Array.from({ length: 1000 }, (_, i) => i + 1)
const blockHashes = Array.from({ length: 1000 }, (_, i) => crypto.randomBytes(32).toString('hex'))

const createInitialBalances = () => {
  const balances = {}
  addresses.forEach((address) => {
    balances[address] = {}
    tickers.forEach((ticker) => {
      balances[address][ticker] = 0
    })
  })
  return balances
}
const balances = createInitialBalances()

const getBlockEvents = (i) => {
  const blockHash = blockHashes[i]
  const blockHeight = blockHeights[i]
  const blockEvents = []
  const numEvents = Math.floor(Math.random() * 100)
  let to, from, ticker, type, amount, valid
  for (let i = 0; i < numEvents; i++) {
    to = addresses[Math.floor(Math.random() * addresses.length)]
    ticker = tickers[Math.floor(Math.random() * tickers.length)]
    const availableAdresses = addresses.filter((address) => address !== to && balances[address][ticker] > 0)
    type = availableAdresses.length === 0 ? 'mint' : txTypes[Math.floor(Math.random() * txTypes.length)]
    from = type === 'mint' ? tickerOwners[ticker] : availableAdresses[Math.floor(Math.random() * availableAdresses.length)]
    amount = type === 'mint' ? 1000 : Math.floor(Math.random() * balances[from][ticker])
    valid = Math.random() < 0.95
    if (valid) {
      if (type !== 'mint') balances[from][ticker] -= amount
      balances[to][ticker] += amount
    }
    blockEvents.push({
      type: type,
      tick: ticker,
      amount: amount,
      from: {
        address: type === 'mint' ? null : from,
      },
      to: {
        address: to,
      },
      valid: valid,
      msg: valid === true ? 'ok' : 'false',
    })
  }
  return blockEvents
}

const responses = blockHeights.map((height, i) => ({
  code: 0,
  msg: 'ok',
  data: {
    events: getBlockEvents(i),
    txid: crypto.randomBytes(32).toString('hex'),
  },
}))

console.log(responses[0]['data']['events'][0])

fs.writeFileSync('src/mocks/mockGetBlockEventsResponse/mockResponseArray.json', JSON.stringify(responses))
