const { ethers, deployments, getNamedAccounts } = require("hardhat") 
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

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

    




})