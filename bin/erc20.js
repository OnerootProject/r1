#!/usr/bin/env node
const abiToken = require("../build/contracts/StandardToken")
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
    runtime._contract = new runtime._web3.eth.Contract(abiToken.abi,runtime._contractAddress)
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

async function balanceOf(user) {
    var result = await runtime._contract.methods.balanceOf(user).call()
    console.log("result:", result)
}


async function approve(_spender, _value) {
    var result=await runtime._contract.methods.approve(_spender, _value).send({from:runtime._account.address,gas:100000})
    if(result.status != 1) {
        console.log("approve failed")
    } else {
        console.log("approve ok", result.transactionHash)
    }
}

async function allowance(_owner, _spender) {
    var result = await runtime._contract.methods.allowance(_owner, _spender).call()
    console.log("result:", result)
}

async function transfer(_to,  _value) {
    var result = await runtime._contract.methods.transfer(_to,  _value).send({from:runtime._account.address,gas:100000})
    if(result.status != 1) {
        console.log("transfer failed")
    } else {
        console.log("transfer ok", result.transactionHash)
    }
}

async function transferFrom(_from, _to,  _value) {
    var result = await runtime._contract.methods.transfer(_from, _to,  _value).send({from:runtime._account.address,gas:100000})
    if(result.status != 1) {
        console.log("transferFrom failed")
    } else {
        console.log("transferFrom ok", result.transactionHash)
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


