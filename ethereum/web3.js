import Web3 from "web3";
require('dotenv').config();

let web3;

// window is only available from the browser - not in the server
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else {
    const provider = new Web3.providers.HttpProvider(
        process.env.MY_SEPOLIA_INFURA_KEY
    );
    web3 = new Web3(provider);
}

export default web3;

