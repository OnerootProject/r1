

var Token = artifacts.require("HumanStandardToken");

var Exchange=artifacts.require("R1Exchange");

module.exports = function(deployer, network, accounts) {
    if(network == "development"){
        deploy2Dev(deployer, network, accounts)
    }else if(network=="kovan"){
        deploy2Kovan(deployer, network, accounts)
    }

};

function deploy2Dev(deployer, network, accounts){
    // deployer.deploy(Token);
    // deployer.deploy(Exchange);

    deployer.deploy(Token).then(function () {
        return deployer.deploy(Exchange,
            // "0x0",
            // Token.address,
            {from:accounts[0]});
    })

    // deployer.deploy(Exchange,
    //     "0x7Da8470794fD52463956D8deeD55eDec9fA6C662",
    //     {from:accounts[0]});
}

function deploy2Kovan(deployer, network, accounts){

    deployer.deploy(Exchange,
        "0x7Da8470794fD52463956D8deeD55eDec9fA6C662",
        {from:"0xC4A9A64a9b63Bac398552065759b34c9BE244BC6"});
    // deployer.deploy(Token,{from:accounts[2],overwrite: true});
    // const exParam={
    //     feeAddr:accounts[0],
    //     accountControlSC_:0,
    //     feeOrder:0,
    //     feeTrade:web3.toWei(0.01,"ether"),
    //     feeReward:0,
    //     baseTokenAddr:0
    // }

    // deployer.deploy(ExchangeData).then(function () {
    //     return deployer.deploy(Exchange,
    //         ExchangeData.address,
    //         exParam.feeAddr,exParam.accountControlSC_,
    //         exParam.feeOrder,exParam.feeTrade,exParam.feeReward,exParam.baseTokenAddr,{from:accounts[2]});
    // }).then(function () {
    //     return deployer.deploy(ExchangeProxy,
    //         ExchangeData.address,
    //         Exchange.address,
    //         {from:accounts[2]}
    //     );
    // });
}