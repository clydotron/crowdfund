const assert = require('assert');
const ganache = require('ganache');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

// different syntax for Contract (already is JSON)
// increased gas limit.
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '3000000' });
    
    console.log("created and deployed")
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    // curious syntax
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    );
})


describe("Campaigns", () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    })

    it("marks caller as campaign manager", async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    })

    it('allows people to contribute money and be added as a contributor', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: 5,
                from: accounts[1]
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('allows manager to make payment request', async () => {

        await campaign.methods
            .createRequest("buy batteries", '100', accounts[2])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        
        const request = await campaign.methods.requests(0).call();
        assert.equal("buy batteries", request.description)
    });

    it('processes requests', async () => {
        
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest("a request", web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000' });
        
        await campaign.methods.approveRequest(0)
            .send({ from: accounts[0], gas: '1000000' })
        
        await campaign.methods.finalizeRequest(0)
            .send({ from: accounts[0], gas: '1000000' })
        
        // improvement: get the balance at start of test
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        assert(balance > 103);
    })

    // TODO add some additional tests:
})