# Dejournal Ðapp

Dejournal is a Distributed Application (Dapp) running on the Ethereum Blockchain.
It allows you to :
- Save arbitrary text on the InterPlanetary File System (IPFS )
- Receive a receipt for your text submission
- Prove time of submission (via block timestamp)

Submission price collected by the contract: 0.001 ETH

## Demo

App live at: [https://dejournal-39b67.firebaseapp.com/](https://dejournal-39b67.firebaseapp.com/)

Deployed Contract on Rinkeby: [0xB22c2C1D1289B873bcbB25560D73048435B7220d](https://rinkeby.etherscan.io/address/0xB22c2C1D1289B873bcbB25560D73048435B7220d)

## Tools


- Framework : Truffle
- Smart contracts : Solidity
- Front End: React

## Running locally

1. Install Ganache, import network and key to Metamask ([Instructions](https://www.codementor.io/swader/developing-for-ethereum-getting-started-with-ganache-l6abwh62j))
2. Deploy the contract to private network ([Instructions](https://hackernoon.com/ethereum-development-walkthrough-part-2-truffle-ganache-geth-and-mist-8d6320e12269)). 
  TLDR; Make any required network changes in truffle-config.js. Then deploy with `truffle migrate`.
3. Enter folder`client` and install dependencies with `npm install`.
4. Start development server with `npm run start`.
5. Select the local Ethereum network in Metamask addon. Then go to `http://127.0.0.1:3000`.

