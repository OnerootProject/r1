var solc = require('solc')
var fs = require("fs")
var abi = require('ethereumjs-abi')
var source = fs.readFileSync("./build/flattened/R1Exchange_flat.sol").toString()

// console.log("abi:",source.abi)
// console.log("bytecode:",source.bytecode)
var input = {
    "ex.sol": source
}
// console.log(source)
var output = solc.compile({sources: input}, 1)

for (var contractName in output.contracts) {
    console.log(contractName)
}

params = packValues(["address"], ["0x7Da8470794fD52463956D8deeD55eDec9fA6C662"])
console.log(params)

// console.log("bytecode:", output.contracts["ex.sol:R1Exchange"].bytecode + params)
// console.log("abi:", "'"+output.contracts["ex.sol:R1Exchange"].interface+"'")

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