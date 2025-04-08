const { ethers } = require("hardhat") 
const { assert } = require("chai")

describe("test fundme contract", async function(){
    it("test if owner is msg.sender", async function () {
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        const fundMe = await fundMeFactory.deploy(180) 
        await fundMe.waitForDeployment()
        const [firstAccount] = await ethers.getSigners()
        assert.equal((await fundMe.owner()), firstAccount.address)
    })

    it("test if dataFeed is assigned correctly", async function () {
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        const fundMe = await fundMeFactory.deploy(180) 
        await fundMe.waitForDeployment()
        assert.equal((await fundMe.dataFeed()), "0x694AA1769357215DE4FAC081bf1f309aDC325306")
    })
})