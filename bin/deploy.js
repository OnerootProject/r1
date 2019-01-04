#!/usr/bin/env node

var solc = require('solc')
var abi = require('ethereumjs-abi')
var solc = require('solc')
var FileUtils = require("../util/FileUtils")
var param = require('commander')

const buildPath = __dirname+'/../build'

const Web3 = require("web3")

var config = {
    //gwei
    gasPrice: 10,
    network: {
        dev: 'http://localhost:8545',
        main: 'https://mainnet.infura.io/bOvbiqbRT3nMOdB2jvMg',
        kovan: 'https://kovan.infura.io/bOvbiqbRT3nMOdB2jvMg',
        ropsten: 'https://ropsten.infura.io/bOvbiqbRT3nMOdB2jvMg',
        rinkeby: 'https://rinkeby.infura.io/bOvbiqbRT3nMOdB2jvMg'
    }
}

var runtime = {
    _web3: null,
    _network: null,
    _account: null,
    _ownerPrivateKey: null
}

param
    .version('1.0.0')
    .option('-p, --privkey <value>', 'private key')
    .option('-n, --network [value]', "network, dev|main|kovan|ropsten|rinkeby, default is dev")
    .option('-g, --gasprice [value]', "gas price, unit is gwei")
    .parse(process.argv)

function init() {
    if(!FileUtils.existsSync(buildPath +"/flattened/R1Exchange_flat.sol")) {
        console.log('Not found source code:', buildPath +"/flattened/R1Exchange_flat.sol\n");
        console.log('Please run ./compile.sh first');
        return false;
    }
    if(!FileUtils.existsSync(buildPath)) {
        FileUtils.mkdirSync(buildPath)
    }
    if(!FileUtils.existsSync(buildPath+'/compile')) {
        FileUtils.mkdirSync(buildPath+'/compile')
    }

    runtime._web3 = new Web3(runtime._network)

    runtime._account = runtime._web3.eth.accounts.wallet.add(runtime._ownerPrivateKey)

    console.log('network:', runtime._network);
    return true;
}


async function run() {
    if(!init()) {
        return;
    }

    let res = compile();
    if(!res) {
        console.log('Fail to compile');
        return;
    }

    try {
        if(res.bytecode.substring(0,2) != '0x') {
            res.bytecode = '0x'+ res.bytecode
        }
        res.interface = JSON.parse(res.interface);
        let result = await deployContract(runtime._account, res.interface, res.bytecode, [])
        // console.log('result:', result)
        console.log('contractAddr:', result.contractAddress)
    } catch (e) {
        console.log('error:', e)
    }
}

function deployContract(account,abi, code, arguments) {
    console.log('deployContract...')
    var myContract = new runtime._web3.eth.Contract(abi)
    return new Promise((resolve, reject) => {
        myContract.deploy({
            data: code,
            arguments: arguments
        }).send({
            from: account.address,
            gasPrice: runtime._web3.utils.toWei(config.gasPrice+'', "gwei"),
            gas: 5000000
        })
            .on('error', function (res) {
                reject(res)
            })
            .on('receipt', function (res) {
                resolve(res)
            })
    })
}

function compile() {
    let input = {
        "ex.sol": FileUtils.readFileSync(buildPath+'/flattened/R1Exchange_flat.sol').toString()
    }
    let settings = {
        optimizer: {
            // disabled by default
            enabled: true,
            // Optimize for how many times you intend to run the code.
            // Lower values will optimize more for initial deployment cost, higher values will optimize more for high-frequency usage.
            runs: 200
        }
    }

// console.log(source)
    let output = solc.compile({sources: input, settings:settings}, 1)
    //
    // for (let contractName in output.contracts) {
    //     console.log(contractName)
    // }
    return output.contracts["ex.sol:R1Exchange"]
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

    runtime._ownerPrivateKey = param.privkey

    if(!runtime._ownerPrivateKey) {
        console.error('Invalid command: %s\nSee --help for a list of available commands.', param.args.join(' '));
        return;
    }

    if(runtime._ownerPrivateKey.toLowerCase().substring(0,2) != '0x' ) {
        runtime._ownerPrivateKey = '0x' + runtime._ownerPrivateKey
    }


}catch(e) {
    console.error(e);
}

run().then();

