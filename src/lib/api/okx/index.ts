import mockResponseArray from '../../../mocks/mockGetBlockEventsResponse/mockResponseArray.json'

export async function getBlockEvents(blockHeight: number) {
  const res = JSON.parse(JSON.stringify(mockResponseArray))[blockHeight - 1]
  return res
  {
    /* TODO: implement okx request after ord node sync */
  }
}
