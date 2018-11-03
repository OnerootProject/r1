const Web3 = require("web3")
var assert = require('assert')
var abi = require('ethereumjs-abi')
it("parse", async () => {
    var json = [[["0x53e7e00fFb9258CC52F331a4198D2E8f28B57116","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x53e7e00fFb9258CC52F331a4198D2E8f28B57116","0x838ed289c2d69d532eb2336dd38882f8d05aa3fb","0x93a1b66da3934057d7fc62136ad38bf81f0ecf6a","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x0000000000000000000000000000000000000000","0x00B9022a6b81E954129d6f807d7c9F3274820176"]],[["1960000000000000000","1147345560000000000","143664080000000000","15660000000000000000","11759950020212413","1120000000000000",99999999,99999999,1539593393078,1539593398843,"1960000000000000000"]],[[28,28]],[["0x3c9954ae393a702b17dd0cbc5cb1ff50fe5917d2442c5e2b74d7956b1607042a","0xe6c3d29d73d234b21991488b782e703bb8ba80af72b09c9a5bcdbe457829888f"]],[["0xd0af475fec4f0e865f72ea5a6ae612117eb10fb9e502f50fca325a280a3d99","0x18bbc460a53269a8a5333e6be15039ea8550691b6c8ff8b42628ced76872ebe1"]]]

    var addresses = json[0][0], values = json[1][0]

    var maker = {
        tokenBuy: addresses[0],
        tokenSell: addresses[2],
        user: addresses[4],
        amountBuy: values[0],
        amountSell: values[2],
        fee: values[4],
        expires: values[6],
        nonce: values[8],
        orderHash: 0,
        baseToken: addresses[6],
        feeToken: addresses[8],
    }
    maker.hash= "0x"+abi.soliditySHA3(["address","uint256","address","uint256","address","uint256","uint256","address"],
        [maker.tokenBuy,maker.amountBuy,maker.tokenSell,maker.amountSell,maker.base,maker.expires,maker.nonce,maker.feeToken]).toString("hex")
    var taker = {
        tokenBuy: addresses[1],
        tokenSell: addresses[3],
        user: addresses[5],
        amountBuy: values[1],
        amountSell: values[3],
        fee: values[5],
        expires: values[7],
        nonce: values[9],
        orderHash: 0,
        baseToken: addresses[7],
        feeToken: addresses[9]
    }
    taker.hash= "0x"+abi.soliditySHA3(["address","uint256","address","uint256","address","uint256","uint256","address"],
        [taker.tokenBuy,taker.amountBuy,taker.tokenSell,taker.amountSell,taker.base,taker.expires,taker.nonce,taker.feeToken]).toString("hex")

    var feeAccount = addresses[10]
    var tradeAmount = values[10]
    console.log("maker:", maker)
    console.log("taker:", taker)
    console.log("tradeAmount:", tradeAmount)
    console.log("feeAccount:", feeAccount)

    // assert.equal("",true,"");
    //check price match
    assert.equal(maker.amountSell * taker.amountSell >= maker.amountBuy * taker.amountBuy, true, "price not match")
    // var makerPrice, takerPrice
    // if (maker.tokenBuy == "0x0000000000000000000000000000000000000000") {//taker buy
    //     makerPrice = maker.amountBuy / maker.amountSell
    //     takerPrice = taker.amountSell / taker.amountBuy
    //     console.log("price:", makerPrice, takerPrice)
    //     assert.equal(takerPrice >= makerPrice, true, "price not match:" + takerPrice + " >=? " + makerPrice)
    // } else {//taker sell
    //     makerPrice = maker.amountBuy / maker.amountSell
    //     takerPrice = taker.amountSell / taker.amountBuy
    //     console.log("price:", makerPrice, takerPrice)
    //     assert.equal(takerPrice <= makerPrice, true, "price not match:" + takerPrice + " <=? " + makerPrice)
    // }


    // console.log("vrs:", json[2], json[3], json[4])
})