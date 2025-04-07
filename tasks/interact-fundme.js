const { task } = require("hardhat/config")

task("interact-contract", "interact with fundme contract")
.addParam("addr", "fundme contract address")
.setAction(
    async(taskArgs, hre) => {

        const [firstAccount, secondAccount] = await ethers.getSigners()

        const fundMeFactory = await ethers.getContractFactory("FundMe")

        const fundMe = fundMeFactory.attach(taskArgs.addr)

        //第一次转账
    
        const fundTX = await fundMe.fund({value : ethers.parseEther("0.5")})
        
        await fundTX.wait()
    
        const BalanceOfContract = await ethers.provider.getBalance(fundMe.target)
    
        console.log("Balance of contract is : " + BalanceOfContract)
    
    
        //第二次转账
        const fundTXWithSecondAccount = await fundMe.connect(secondAccount).fund({value : ethers.parseEther("0.5")})
        
        await fundTXWithSecondAccount.wait()
    
        const BalanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)
    
        console.log("Balance of contract is : " + BalanceOfContractAfterSecondFund)
    
        //查看账户余额
        const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
        const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
    
        console.log("Balance of firs Account is : " + firstAccountBalanceInFundMe)
        console.log("Balance of second Account is : " + secondAccountBalanceInFundMe)
    }
)