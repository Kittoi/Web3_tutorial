const { ethers, deployments, getNamedAccounts } = require("hardhat") 
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

describe("test fundme contract", async function(){

    let fundMe
    let fundMeSecondAccount
    let firstAccount
    let secondAccount
    let mockV3Aggregator

    beforeEach(async function(){
        //fixture 用于重置测试环境
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        secondAccount = (await getNamedAccounts()).secondAccount

        const fundMeDeployment = await deployments.get("FundMe")
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
        fundMeSecondAccount = await ethers.getContractAt("FundMe", secondAccount)
    })

    it("test if owner is msg.sender", async function () {
        // const fundMeFactory = await ethers.getContractFactory("FundMe")
        // const fundMe = await fundMeFactory.deploy(180) 
        await fundMe.waitForDeployment()
        // const [firstAccount] = await ethers.getSigners()
        assert.equal((await fundMe.owner()), firstAccount)
    })

    it("test if dataFeed is assigned correctly", async function () {
        // const fundMeFactory = await ethers.getContractFactory("FundMe")
        // const fundMe = await fundMeFactory.deploy(180) 
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.dataFeed()), mockV3Aggregator.address)
    })


    it(" window closed, value grater than minimun, fund failed", async function () {

        //make sure the window is closed
        await helpers.time.increase(200)
        await helpers.mine()
        
        //value is greater minimun value
        expect(fundMe.fund({value: ethers.parseEther("0.1")}))
            .to.be.revertedWith("window is closed") 
    })

    it("window open, value is less than minimum, fund failed", async function () {
        //value is greater minimun value
        expect(fundMe.fund({value: ethers.parseEther("0.01")}))
            .to.be.revertedWith("Send more ETH") 
    })

    it("window open, value is greater minimum, fund success", async function () {
        //value is greater minimun value
        await fundMe.fund({value: ethers.parseEther("0.1")})
        
        const balance = await fundMe.fundersToAmount(firstAccount)

        expect(balance).to.equal(ethers.parseEther("0.1"))
    })

    it("not owner, windows closed, target reached, getFundFailed", async function(){
        //make sure the target is reached
        await fundMe.fund({value: ethers.parseEther("1")})

        await helpers.time.increase(200)
        await helpers.mine()

        expect(fundMeSecondAccount.getFund()).to.be.revertedWith("this function can only be called by owner")
    })

    it("window open, target reached, getFund Failed", async function(){
        //make sure the target is reached
        await fundMe.fund({value: ethers.parseEther("1")})
        expect(fundMeSecondAccount.getFund()).to.be.revertedWith("window is not closed")

    })

    it("window closed,  target not reached, getFund Failed", async function(){
        //make sure the target is reached
        await fundMe.fund({value: ethers.parseEther("0.1")})

        await helpers.time.increase(200)
        await helpers.mine()

        await expect(fundMe.getFund()).to.be.revertedWith("Target is not reached")
        
    })

    it("window closed,  target reached, getFund success", async function(){
        //make sure the target is reached
        await fundMe.fund({value: ethers.parseEther("1")})

        await helpers.time.increase(200)
        await helpers.mine()

        await expect(fundMe.getFund()).
            to.emit(fundMe, "FundWithdrawByOwner")
            .withArgs(ethers.parseEther("1"))  
    })

    //refund
    //windowClosed, target not reached, funder has ballance
    it("window open, target not reached, funder has balance", async function(){
        await fundMe.fund({value: ethers.parseEther("0.1")})
        expect(fundMe.refund()).to.be.revertedWith("window is not closed")
    })

    it("window closed, target reached, funder has balance", async function(){
        await fundMe.fund({value: ethers.parseEther("1")})

        await helpers.time.increase(200)
        await helpers.mine()

        expect(fundMe.refund()).to.be.revertedWith("Target is reached")        
    })

    it("window closed, target reached, funder has no balance", async function(){
        await fundMe.fund({value: ethers.parseEther("1")})

        await helpers.time.increase(200)
        await helpers.mine()

        expect(fundMe.refund()).to.be.revertedWith("Target is reached")        
    })

    it("window closed, target not reached, funder has no balance", async function(){
        await fundMe.fund({value: ethers.parseEther("0.1")})

        await helpers.time.increase(200)
        await helpers.mine()

        expect(fundMeSecondAccount.refund()).to.be.revertedWith("there is no fund for you")        
    })

    it("window closed, target reached, funder has balance", async function(){
        await fundMe.fund({value: ethers.parseEther("1")})

        await helpers.time.increase(200)
        await helpers.mine()

        expect(fundMe.refund()).to.emit(fundMe, "RefundByFunder")
        .withArgs(firstAccount, ethers.parseEther("1"))  
    })



})