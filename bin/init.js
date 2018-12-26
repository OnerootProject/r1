#!/usr/bin/env node
const abiR1Exchange = require("../build/contracts/R1Exchange")
const Web3 = require("web3")
//https://mainnet.infura.io/bOvbiqbRT3nMOdB2jvMg
var web3 = new Web3("https://kovan.infura.io/v3/4e987044d78c44319523b16c7bf0412c")

var account=web3.eth.accounts.wallet.add("0xa6301834a2351a1b5740ea46a8ecd881904235950a7daba6ae41c5806cc4a766")//test account
var admin="0x031d8da61261bc51e95affcc74359bbd6fcf388d",feeAcc="0x00B9022a6b81E954129d6f807d7c9F3274820176"

process.on('uncaughtException', function (err) {
    Log.error(err, __filename+':Caught exception: ');
});

function usage() {
    console.log('please input <contract address>')
}

var args = process.argv.slice(2);
if(!args || args.length <1) {
    usage();
    return;
} 
var contractAddr = args[0];
var myContract = new web3.eth.Contract(abiR1Exchange.abi,contractAddr);
var action = null;
var user = null;

// args[0]: contractAddr
// args[1]: walletAddr
// args[2]: action type: admin|fee 
if(args.length == 3) {
    if(args[2] == 'admin') {
        admin = args[1];
        setAdmin().then();
    } else if(args[2] == 'fee') {
        feeAcc = args[1];
        setFeeAccount().then();
    }
} else {
    setAdmin().then();
    setFeeAccount.then();
}

async function setAdmin() {
    console.log('setAdmin...')
    var result=await myContract.methods.setAdmin(admin,true).send({from:account.address,gas:100000})
    if(result.status != 1) {
        console.log("set admin failed")
    } else {
        console.log("set admin ok", result.transactionHash)
    }
}

async function setFeeAccount() {
    console.log('setFeeAccount...')
    result = await myContract.methods.setFeeAccount(feeAcc,true).send({from:account.address,gas:100000})
    if(result.status != 1) {
        console.log("set fee account failed")
    } else {
        console.log("set fee account ok", result.transactionHash)
    }
}

