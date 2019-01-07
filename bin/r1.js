#!/usr/bin/env node
const abiR1Exchange = require("../build/contracts/R1Exchange")
const Web3 = require("web3")
var param = require('commander')


var config = {
    //gwei
    network: {
        dev: 'http://localhost:8545',
        main: 'https://mainnet.infura.io/bOvbiqbRT3nMOdB2jvMg',
        kovan: 'https://kovan.infura.io/bOvbiqbRT3nMOdB2jvMg',
        ropsten: 'https://ropsten.infura.io/bOvbiqbRT3nMOdB2jvMg',
        rinkeby: 'https://rinkeby.infura.io/bOvbiqbRT3nMOdB2jvMg'
    }
}

var runtime = {
    //gwei
    _gasPrice: 10,
    _web3: null,
    _network: null,
    _contract: null,
    _contractAddress: null,
    _account: null,
    _ownerPrivateKey: null,
    _function: null,
}

function init() {
    runtime._web3 = new Web3(runtime._network)
    runtime._contract = new runtime._web3.eth.Contract(abiR1Exchange.abi,runtime._contractAddress)
    console.log('network:', runtime._network)
    if(runtime._ownerPrivateKey) {
        runtime._account = runtime._web3.eth.accounts.wallet.add(runtime._ownerPrivateKey)
        console.log('wallet address:', runtime._account.address)
    }

    return true;
}

process.on('uncaughtException', function (err) {
    Log.error(err, __filename+':Caught exception: ');
});


param
    .version('1.0.0')
    .option('-a, --address <value>', 'contract address')
    .option('-f, --function <value>', "function call")
    .option('-n, --network [value]', "network, dev|main|kovan|ropsten|rinkeby, default is dev")
    .option('-p, --privkey [value]', 'private key')
    .option('-v, --value [value]', 'ETH value')
    .option('-g, --gasprice [value]', "gas price, unit is gwei")
    .parse(process.argv)


// functions

async function balanceOf(token, user, channelId) {
    var result = await runtime._contract.methods.balanceOf(token, user, channelId).call()
    console.log("result:", result)
}


async function setAdmin(admin) {
    var result=await runtime._contract.methods.setAdmin(admin,true).send({from:runtime._account.address,gas:100000})
    if(result.status != 1) {
        console.log("set admin failed")
    } else {
        console.log("set admin ok", result.transactionHash)
    }
}

async function setFeeAccount(feeAcc) {
    var result = await runtime._contract.methods.setFeeAccount(feeAcc,true).send({from:runtime._account.address,gas:100000})
    if(result.status != 1) {
        console.log("set fee account failed")
    } else {
        console.log("set fee account ok", result.transactionHash)
    }
}

async function deposit(channelId) {
    var result = await runtime._contract.methods.deposit(channelId).send({from:runtime._account.address,value:runtime._value,gas:100000})
    if(result.status != 1) {
        console.log("deposit failed")
    } else {
        console.log("deposit ok", result.transactionHash)
    }
}

async function depositTo(to, channelId) {
    var result = await runtime._contract.methods.depositTo(to, channelId).send({from:runtime._account.address,value:runtime._value,gas:100000})
    if(result.status != 1) {
        console.log("depositTo failed")
    } else {
        console.log("depositTo ok", result.transactionHash)
    }
}

async function depositTokenTo(token, to, amount, channelId) {
    var result = await runtime._contract.methods.depositTokenTo(token, to, amount, channelId).send({from:runtime._account.address,gas:100000})
    if(result.status != 1) {
        console.log("depositTokenTo failed")
    } else {
        console.log("depositTokenTo ok", result.transactionHash)
    }
}


/// main ///
// console.log(param)
try {
    for(let k in config.network) {
        if(param.network == k) {
            runtime._network = config.network[k]
            break;
        }
    }

    if(!runtime._network) {
        runtime._network = config.network.dev
    }

    if(param.gasprice) {
        runtime._gasPrice = param.gasprice
    }

    if(param.value) {
        runtime._value = param.value
    }

    runtime._contractAddress = param.address
    if(!runtime._contractAddress) {
        console.error('Invalid command: %s\nSee --help for a list of available commands.', param.args.join(' '));
        return;
    }

    runtime._function = param.function
    if(!runtime._function) {
        console.error('Invalid command: %s\nSee --help for a list of available commands.', param.args.join(' '));
        return;
    }

    runtime._ownerPrivateKey = param.privkey
    if(runtime._ownerPrivateKey && runtime._ownerPrivateKey.toLowerCase().substring(0,2) != '0x' ) {
        runtime._ownerPrivateKey = '0x' + runtime._ownerPrivateKey
    }

    init();

    console.log(runtime._function);
    eval(runtime._function);


}catch(e) {
    console.error(e);
}


