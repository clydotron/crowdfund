import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(CampaignFactory.abi, "0x9eeC402501a70D87f82371f638f4f7eC5D787BAa");
export default instance;