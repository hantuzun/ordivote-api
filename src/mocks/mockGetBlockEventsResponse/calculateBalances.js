const mockResponseArray = require('./mockResponseArray.json')

const calculateBalances = (block, ticker) => {
  const balances = {}
  mockResponseArray.slice(0, block).forEach((response) => {
    const events = response.data.events
    events.forEach((event) => {
      if (event.tick === ticker && event.valid === true) {
        const from = event.from.address
        const to = event.to.address
        if (from) {
          balances[from] = balances[from] || 0
          balances[from] -= event.amount
        }
        balances[to] = balances[to] || 0
        balances[to] += event.amount
      }
    })
  })
  return balances
}

console.log(calculateBalances(500, 'tid'))
