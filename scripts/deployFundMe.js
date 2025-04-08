// import ethers
require("@chainlink/env-enc").config()

const {ethers} = require("hardhat")





async function main() {

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


    const [firstAccount, secondAccount] = await ethers.getSigners()

    //第一次转账

    const fundTX = await fundMe.fund({value : ethers.parseEther("0.05")})
    
    await fundTX.wait()

    const BalanceOfContract = await ethers.provider.getBalance(fundMe.target)

    console.log("Balance of contract is : " + BalanceOfContract)


    //第二次转账
    const fundTXWithSecondAccount = await fundMe.connect(secondAccount).fund({value : ethers.parseEther("0.05")})
    
    await fundTXWithSecondAccount.wait()

    const BalanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)

    console.log("Balance of contract is : " + BalanceOfContractAfterSecondFund)

    //查看账户余额
    const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
    const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)

    console.log("Balance of firs Account is : " + firstAccountBalanceInFundMe)
    console.log("Balance of second Account is : " + secondAccountBalanceInFundMe)



}

async function verifyFundme(fundMeAddr, arg){
    await hre.run("verify:verify", {
        address: fundMeAddr,
        constructorArguments: arg,
    });
} 

main().then().catch((error) => {
    console.log(error)
    process.exit(1)
})