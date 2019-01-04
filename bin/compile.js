#!/usr/bin/env node

var solc = require('solc')
var fs = require("fs")
var abi = require('ethereumjs-abi')
var source = fs.readFileSync(__dirname +"/../build/flattened/R1Exchange_flat.sol").toString()

// console.log("abi:",source.abi)
// console.log("bytecode:",source.bytecode)
var input = {
    "ex.sol": source
}
var settings = {
    optimizer: {
        // disabled by default
        enabled: true,
        // Optimize for how many times you intend to run the code.
        // Lower values will optimize more for initial deployment cost, higher values will optimize more for high-frequency usage.
        runs: 200
    }
}

// console.log(source)
var output = solc.compile({sources: input, settings:settings}, 1)

for (var contractName in output.contracts) {
    console.log(contractName)
}

params = packValues(["address"], ["0x899b5aab87326cafc71189f87a36584e02be2c83"])
console.log(params)

console.log("bytecode:", output.contracts["ex.sol:R1Exchange"].bytecode)
console.log("abi:", "'"+output.contracts["ex.sol:R1Exchange"].interface+"'")

function packValues(types, values) {
    let v = ""
    for (i = 0; i < types.length; i++) {
        param = abi.solidityPack([types[i]], [values[i]]).toString("hex")
        v += addZero(param)
    }
    return v
}

function addZero(param) {
    let zero=""
    for (i = 0; i < 64 - param.length; i++) {
        zero+="0"
    }
    return zero+param
}
