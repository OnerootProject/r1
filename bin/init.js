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
    _account: null
}


process.on('uncaughtException', function (err) {
    Log.error(err, __filename+':Caught exception: ');
});


param
    .version('1.0.0')
    .option('-a, --address <value>', 'contract address')
    .option('-p, --privkey <value>', 'private key')
    .option('-f, --function <value>', "function name, admin|fee")
    .option('-w, --wallet <value>', "wallet address")
    .option('-n, --network [value]', "network, dev|main|kovan|ropsten|rinkeby, default is dev")
    .option('-g, --gasprice [value]', "gas price, unit is gwei")
    .parse(process.argv)

function init() {
    runtime._web3 = new Web3(runtime._network)
    runtime._contract = new runtime._web3.eth.Contract(abiR1Exchange.abi,param.address)
    console.log('network:', runtime._network)
    if(param.privkey) {
        runtime._account = runtime._web3.eth.accounts.wallet.add(param.privkey)
        console.log('wallet address:', runtime._account.address)
    }

    return true;
}

// functions

async function setAdmin() {
    var result=await runtime._contract.methods.setAdmin(param.wallet,true).send({from:runtime._account.address,gas:100000})
    if(result.status != 1) {
        console.log("set admin failed")
    } else {
        console.log("set admin ok", result.transactionHash)
    }
}

async function setFeeAccount() {
    var result = await runtime._contract.methods.setFeeAccount(param.wallet,true).send({from:runtime._account.address,gas:100000})
    if(result.status != 1) {
        console.log("set fee account failed")
    } else {
        console.log("set fee account ok", result.transactionHash)
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

    if(!param.address) {
        console.error('No --address');
        console.error('Invalid command: %s\nSee --help for a list of available commands.', param.args.join(' '));
        return;
    }

    if(!param.function) {
        console.error('No --function');
        console.error('Invalid command: %s\nSee --help for a list of available commands.', param.args.join(' '));
        return;
    }

    if(!param.privkey) {
        console.error('No --privkey');
        console.error('Invalid command: %s\nSee --help for a list of available commands.', param.args.join(' '));
        return;
    }

    if(param.privkey && param.privkey.toLowerCase().substring(0,2) != '0x' ) {
        param.privkey = '0x' + param.privkey
    }

    if(!param.wallet) {
        console.error('Invalid command: %s\nSee --help for a list of available commands.', param.args.join(' '));
        return;
    }

    init();
    
    if(param.function == 'admin') {
        setAdmin().then();
    } else if(param.function == 'fee') {
        setFeeAccount().then();
    } else {
        console.error('Unknown function name');
        console.error('Invalid command: %s\nSee --help for a list of available commands.', param.args.join(' '));
        return;
    }


}catch(e) {
    console.error(e);
}


