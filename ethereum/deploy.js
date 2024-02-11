const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { abi, evm } = require("../ethereum/build/CampaignFactory.json");

require('dotenv').config();

console.log(process.env);

const provider = new HDWalletProvider(
    process.env.MY_MNEMONIC,
    process.env.MY_SEPOLIA_INFURA_KEY
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('attempting to deploy from account', accounts[0])
    
    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ gas: '3000000', from: accounts[0] });
    
    console.log('Contract deployed to:', result.options.address);
    provider.engine.stop()
};

deploy();


