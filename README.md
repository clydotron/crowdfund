# Crowdfund

## Kickstarter meets blockchain.
Small application that uses Etherium as currency for crowd funded campaigns. Intended to reduce the fraud/abuse of Kickstarter by requiring that contributors/supporter approve any payment requests by the manager.

### Basic flow:
* Manger creates the campaign, and specifies a minumum amout of ether that folks must contribute.
* Individuals can contribute to the campaign.
* Manager creates 'requests' to spend/transfer the ether.
* Once a majority of the contributors have approved the request, it can be finalized (and paid).

### Technologies invovled:
Solidity: Etherium contract
React
NextJS

### Services:
Alchemy - ether faucet
Infura - API key for using eht Sepolia network
Metamask

Test network:
Sepolia

### How to use:




Inside the `ethereum` folder:
* Compile the contract file: `node compile.js`
* Deploy the contract to the network `node deploy.js`,
* Copy the address that is output from the deploy step into the  `factory.js` file:
```
import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(CampaignFactory.abi, "0x9eeC402501a70D87f82371f638f4f7eC5D787BAa");
export default instance;
```
Todo: write the address to a file, import the file for factory step.

Start the server:
`npm run test`





