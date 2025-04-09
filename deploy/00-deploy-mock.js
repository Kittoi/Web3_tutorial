const {DECIMAL, INITIAL_ANSWER, developmentChains} = require("../helper-hardhat-config")
const { network } = require("hardhat")

module.exports = async({getNamedAccounts, deployments}) => {

    if(developmentChains.includes(network.name)){
        const firstAccount = (await getNamedAccounts()).firstAccount
        const {deploy} = deployments

        // 部署 FundMe 合约，lockTime 设置为 180 秒
        const fundMe = await  deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],  
            log: true,
        })

        console.log(`FundMe deployed at: ${fundMe.address}`)
        console.log(`Deployed by: ${firstAccount}`)
    }else{
        console.log("network is not local, mock contract deploy skiped")
    }
    
}

module.exports.tags = ["all", "mock"]