

var Token = artifacts.require("HumanStandardToken");

var Exchange=artifacts.require("R1Exchange");

module.exports = function(deployer, network, accounts) {
    if(network == "development"){
        deploy2Dev(deployer, network, accounts)
    } else {
        deploy(deployer, network, accounts)
    }
};

function deploy2Dev(deployer, network, accounts){
    deployer.deploy(Token).then(function () {
        return deploy(deployer, network, accounts);
    })
}

function deploy(deployer, network, accounts){
    var owner = accounts[0];
    var exchangeInstance;
    return deployer.deploy(Exchange,{from:owner}).then(() => {
        return Exchange.deployed();
    }).then((_exchange) => {
        exchangeInstance = _exchange;
        console.log('Exchange address:', exchangeInstance.address);
        return initAccount(exchangeInstance, accounts);
    })
}


async function initAccount(exchangeInstance, accounts) {
    if(!exchangeInstance) {
        return
    }
    var owner = accounts[0];
    var admin="0x031d8da61261bc51e95affcc74359bbd6fcf388d";
    var feeAcc="0x00B9022a6b81E954129d6f807d7c9F3274820176";

    console.log('initAccount...')
    let tx = await exchangeInstance.setAdmin(admin,true, {from: owner,gas:100000});
    console.debug('setAdmin status:', tx.receipt.status);

    tx = await exchangeInstance.setFeeAccount(feeAcc,true, {from: owner,gas:100000});
    console.debug('setFeeAccount status:', tx.receipt.status);

}