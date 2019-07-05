# Dejournal Ðapp

Dejournal is a Distributed Application (Dapp) running on the Ethereum Blockchain.
It allows you to :
- Save arbitrary text on the InterPlanetary File System (IPFS )
- Receive a receipt for your text submission
- Prove time of submission (via block timestamp)

Submission price collected by the contract: 0.001 ETH

## Demo

TODO:

App live at: [https://dejournal-39b67.firebaseapp.com/](https://dejournal-39b67.firebaseapp.com/)

Deployed Contract on Rinkeby: [0xB22c2C1D1289B873bcbB25560D73048435B7220d](https://rinkeby.etherscan.io/address/0xB22c2C1D1289B873bcbB25560D73048435B7220d)

## Tools


- Framework : Truffle
- Smart contracts : Solidity
- Front End: React

## Running locally

Install Ganache and import network and key to Metamask.

To start private network:
````
testrpc
````

Alternatively you can run a local Rinkeby testnet node:
````
geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --unlock="<DEPLOYER_ADDRESS>"
````

Copy truffle-config.js to truffle.js and make any network config changes

To deploy contract:
```` 
truffle migrate
````

To run mocha tests :
```` 
truffle test
````

To run app locally :
```` 
npm run start
````

