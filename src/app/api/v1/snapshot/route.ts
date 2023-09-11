import { getBlockEvents } from '@/lib/api/okx'
import { getBalancesAtBlockHeightWithTicker } from '@/lib/db/balance'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const block = Number(url.searchParams.get('block') as string)
  const ticker = url.searchParams.get('ticker') as string
  const res = await getBalancesAtBlockHeightWithTicker(ticker, block)
  return NextResponse.json(res)
}
