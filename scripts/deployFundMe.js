// import ethers

const {ethers} = require("hardhat")

async function main() {

    const fundMeFactory = await ethers.getContractFactory("FundMe")

    console.log("contract deploying")
    
    const fundMe = await fundMeFactory.deploy(100)

    await fundMe.waitForDeployment()

    console.log("deploy success contract address: ", fundMe.target)
}

main().then().catch((error) => {
    console.log(error)
    process.exit(1)
})