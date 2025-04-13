const { ethers, deployments, getNamedAccounts } = require("hardhat") 
const { assert, expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

const helpers = require("@nomicfoundation/hardhat-network-helpers")

developmentChains.includes(network.name)
? describe.skip
: describe("test fundme contract -- network sepolia", async function(){

    let fundMe
    let firstAccount

    beforeEach(async function(){
        //fixture 用于重置测试环境
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
    })

    it("fund and getFund successfully", async function(){
        await fundMe.fund({value : ethers.parseEther("1")})

        await new Promise(resolve => setTimeout(resolve, 181 * 1000))

        const getFundTx = await fundMe.getFund()
        const getFundReceipt = await getFundTx.wait()

        expect(getFundReceipt)
            .to.be.emit(fundMe, "FundWithdrawByOwner")
            .withArgs(ethers.parseEther("0.5"))
    })

    it("fund and refund successfully", async function(){
        await fundMe.fund({value : ethers.parseEther("0.1")})

        await new Promise(resolve => setTimeout(resolve, 181 * 1000))

        const refundTx = await fundMe.refund()
        const refundReceipt = await refundTx.wait()

        expect(refundReceipt)
            .to.be.emit(fundMe, "RefundByFunder")
            .withArgs(firstAccount, ethers.parseEther("0.1"))
    })




})