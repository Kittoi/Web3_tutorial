// function deployFunction(){
//     console.log("this is a deploy function")


// }

// module.exports.default = deployFunction

module.exports = async({getNamedAccounts}) => {
    const firstAccount = (await getNamedAccounts()).firstAccount
    console.log(firstAccount)
    console.log("this is a deploy function")
}