# ordivote-api
The backend API for Ordivote

## Specifications
Provide an API endpoint for a given BRC-20 and block height.

Develop with multiple BRC-20 tokens in mind, but we will initially use this project for a single token.

## Development Plan

This project could consist of the following steps:

* [ ] Set up a Planetscale database.
* [ ] Save all the BRC-20 transfers to our database from the BiS [Get BRC-20 Activity](https://docs.bestinslot.xyz/reference/api-reference/ordinals-and-brc-20-v3-api/brc-20#get-brc-20-activity) endpoint.
  * Using this endpoint with `last_new_satpoint` would be better. 
* [ ] Create the `GET /v1/snapshot?ticker=ABCD&block=15271002` endpoint.
  * The response could be a sorted array of objects with `address` and `balance`.
* [ ] Add support for the bitcoin testnet.
