const { network } = require("hardhat")

const {LOCK_TIME, developmentChains, networkonfig, COMFIRMATIONS} = require("../helper-hardhat-config")
module.exports = async({getNamedAccounts, deployments}) => {
    const firstAccount = (await getNamedAccounts()).firstAccount
    const {deploy} = deployments

    let dataFeedAddr

    if(developmentChains.includes(network.name)){
        const mockV3Aggreator = await deployments.get("MockV3Aggregator");
        dataFeedAddr = mockV3Aggreator.address
    }else{
        dataFeedAddr = await networkonfig[network.config.chainId].ethUsdDataFeed
    }

    console.log("dataFeedAddr is: "+ dataFeedAddr)

    // 部署 FundMe 合约
    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, dataFeedAddr], 
        log: true,
        waitConfirmations: COMFIRMATIONS
    })



    if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY){
        console.log("Waiting for block confirmations...")
        
        // await new Promise(resolve => setTimeout(resolve, 30000));
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LOCK_TIME, dataFeedAddr],
        });
        console.log(`FundMe deployed at: ${fundMe.address}`)
        console.log(`Deployed by: ${firstAccount}`)
    }else{
        console.log("network is not sepolia, verify skiping")
    }

}

module.exports.tags = ["all", "FundMe"]