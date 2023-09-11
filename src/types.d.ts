type OKXOrdNodeBlockEvent = {
  type: 'mint' | 'transfer'
  tick: string
  inscriptipnId: string
  inscriptionNumber: number
  oldSatpoint: string
  newSatpoint: string
  amount: number
  from: {
    address: string | null
    scriptHash: string | null
  }
  to: {
    address: string
    scriptHash: string | null
  }
  valid: boolean
  msg: string
}

type OKXOrdNodeBlockEventResponse = {
  code: number
  msg: string
  data: {
    block: {
      txid: string
      events: OKXOrdNodeBlockEvent[]
    }[]
  }
}

type MockOKXOrdNodeBlockEventResponse = {
  code: number
  msg: string
  data: {
    txid: string
    events: Partial<OKXOrdNodeBlockEvent>[]
  }
}
