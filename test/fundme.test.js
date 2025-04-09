const { ethers } = require("hardhat") 
const { assert } = require("chai")

describe("test fundme contract", async function(){

    let fundMe
    let firstAccount

    beforeEach(async function(){
        //fixture 用于重置测试环境
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
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
        assert.equal((await fundMe.dataFeed()), "0x694AA1769357215DE4FAC081bf1f309aDC325306")
    })
})