const {task} = require("hardhat/config")

task("deploy-fundme", "Deploy and verify contract").setAction(
    async(taskargs, hre) => {
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        
        console.log("contract deploying")
            
        const fundMe = await fundMeFactory.deploy(300)
        
        await fundMe.waitForDeployment()
        
        console.log("deploy success contract address: ", fundMe.target)
        
        console.log("NetWork ChainId is : " + hre.network.config.chainId)
        console.log("API KEY is : " + process.env.ETHERSCAN_API_KEY)
        
        if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY){
            console.log("Waiting for block confirmations...")
            //等待五个区块
            await fundMe.deploymentTransaction().wait(5)
            await verifyFundme(fundMe.target, [300]);
        }else{
            console.log("Skipping verification")
        }
    }
)

async function verifyFundme(fundMeAddr, arg){
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: arg,
    });
} 