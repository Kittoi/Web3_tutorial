// function deployFunction(){
//     console.log("this is a deploy function")


// }

// module.exports.default = deployFunction

module.exports = async({getNamedAccounts, deployments}) => {


    // the below code is to get the first account
    // as same as below
    // const {firstAccount} = await getNamedAccounts()
    const firstAccount = (await getNamedAccounts()).firstAccount

    const {deploy} = deployments

    await deploy("FundMe", {
        from: firstAccount,
        args: [180],
        log: true
    })
    
    console.log(firstAccount)
    console.log("this is a deploy function")
}

/**
 * C++  ->  C   -> 底层
 * java ->  基本操作，三天速成
 * python -> 会看不会写
 * go -> 同上，但是比py多
 * html,css,vue -> 借助ai的力量完成
 * solidity -> 非常简单，学的人少，一天速成
 * js，ts -> 弱语言，很简单，但是编码坑特别多 interface{}
 */