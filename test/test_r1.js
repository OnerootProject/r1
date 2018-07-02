var RNTToken = artifacts.require("HumanStandardToken"); //token contract
var Exchange = artifacts.require("R1Exchange"); // real exchange contract

var Data = require('./Data')
var abi = require('ethereumjs-abi')
var printData = false;
var exchangeBalance = {
    makerEther: 0,
    makerRNT: 0,
    takerEther: 0,
    takerRNT: 0
};
var admin, owner, maker, taker, feeAccount

contract("Exchange", function (accounts) {

    //   var tokenInstance;
    // var exchangeInstance;
    admin = accounts[1];
    owner = accounts[0];
    maker = accounts[2];
    taker = accounts[3];
    feeAccount = accounts[5]

    it("init token:supply should be 400000000 !", async () => {
        let tokenInstance = await RNTToken.deployed()
        let balance = await tokenInstance.balanceOf.call(accounts[0])
        assert.equal(web3.fromWei(balance.valueOf()), 400000000, "400000000 wasn't the initial supply");
        let result = await tokenInstance.enableTransfer(true, {from: owner})
        assert.equal(result.receipt.status, 1, " enable transfer failed")
    })

    it("set admins and RNT contract!", async () => {
        let exchangeInstance = await Exchange.deployed()
        let result = await exchangeInstance.setAdmin(admin, true, {from: owner})
        assert.equal(result.receipt.status, 1, " setAdmin failed!")
    })
    it("set feeAccount!", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        let result = await exchangeInstance.setFeeAccount(feeAccount, true, {from: owner})
        assert.equal(result.receipt.status, 1, " setFeeAccount failed!")
    })


    var initEth = 100;
    var initRNT = 10000;
    var takerRNTBalance = initRNT + 1000;


    it("deposit ether and token:", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        await exchangeInstance.deposit({value: web3.toWei(initEth, "ether"), from: maker})
        let balance = await exchangeInstance.balanceOf(0, maker)
        assert.equal(web3.fromWei(balance.valueOf()), initEth, "maker deposit " + initEth + " ether failed!")
        exchangeBalance.makerEther = initEth
        await tokenInstance.transfer(taker, web3.toWei(takerRNTBalance, "ether"), {from: owner})
        await tokenInstance.approve(exchangeInstance.address, web3.toWei(1000000000000, "ether"), {from: taker})

        balance = await tokenInstance.allowance(taker, exchangeInstance.address)
        assert.equal(web3.fromWei(balance.valueOf()), 1000000000000, "approve failed")

        let result = await exchangeInstance.depositToken(tokenInstance.address, web3.toWei(initRNT, "ether"), {from: taker})
        assert.equal(result.receipt.status, 1, "taker deposit rnt failed");
        exchangeBalance.takerRNT = initRNT

        balance = await exchangeInstance.balanceOf(tokenInstance.address, taker)
        assert.equal(web3.fromWei(balance.valueOf()), initRNT, "taker deposit " + initRNT + " rnt failed")


    })
    it("adminWithdraw", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        hash = "0x" + abi.soliditySHA3(["address", "address", "uint256", "uint256"],
            [taker, tokenInstance.address, web3.toWei("1", "ether"), 11]
        ).toString("hex")
        console.log("=========", hash)
        var signed = web3.eth.sign(taker, hash);
        orderSigned = signed.substring(2, signed.length);
        r = "0x" + orderSigned.slice(0, 64);
        s = "0x" + orderSigned.slice(64, 128);
        v = web3.toDecimal(orderSigned.slice(128, 130)) + 27;
        result = await exchangeInstance.adminWithdraw([taker, tokenInstance.address, feeAccount], [web3.toWei("1", "ether"), 11, 0], v, r, s, {from: admin})
        assert.equal(result.receipt.status, 1, "adminWithdraw failed!")
        exchangeBalance.takerRNT = exchangeBalance.takerRNT - 1
    })

    var makerOrder = {
        tokenBuy: 0,
        tokenSell: 0,
        user: maker,
        amountBuy: web3.toWei("100", "ether"),
        amountSell: web3.toWei("10", "ether"),
        baseToken: 0,
        expires: 5000000,
        fee: web3.toWei("0.1", "ether"),
        nonce: Date.now(),
        v: 0,
        r: 0,
        s: 0,
        feeToken: 0
    };
    var takerOrder = {
        tokenBuy: 0,
        tokenSell: 0,
        user: taker,
        amountBuy: web3.toWei("1", "ether"),
        amountSell: web3.toWei("10", "ether"),
        baseToken: "0x0",
        expires: 5000000,
        fee: 0,
        nonce: Date.now(),
        v: 0,
        r: 0,
        s: 0,
        feeToken: 0
    };

    testTrade("trade:sell1*sell2 = buy1*buy2", makerOrder, takerOrder)

    // testTradeNotMatch("no match trade: sell1*sell2<buy1*buy2", makerOrder, takerOrder)

    it("test equal price", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        let src = "./test/data/data.csv"

        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await takerSell(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether"), web3.toWei("20", "ether")])
    })

    it("taker sell :takerAmount<=makerAmount", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        let src = "./test/data/data_taker_sell_2.csv"

        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await takerSell(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether")])
    })

    it("taker sell :takerAmount>makerAmount ", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        let src = "./test/data/data_taker_sell_1.csv"

        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await takerSell(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether")])

    })
    it("taker sell :buy remain <0 ", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        let src = "./test/data/data_taker_sell_3.csv"

        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await takerSell(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("15", "ether"), web3.toWei("10", "ether")])

    })

    it("taker sell :multi sell  ", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        let src = "./test/data/data_taker_sell_4.csv"

        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await takerSell(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether"), web3.toWei("10", "ether")])

    })


    it("taker buy：takerAmount<=makerAmount ", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        let src = "./test/data/data_taker_buy_1.csv"

        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await takerBuy(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether")])

    })
    it("taker buy ：takerAmount>makerAmount ", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        let src = "./test/data/data_taker_buy_2.csv"

        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await takerBuy(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether")])

    })
    it("taker buy ：multi sell ", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        let src = "./test/data/data_taker_buy_3.csv"

        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await takerBuy(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether"), web3.toWei("10", "ether")])

    })

    it("test full", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        let src = "./test/data/data_full.csv"

        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await takerSell(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether"), web3.toWei("10", "ether")])
    })

    testSameUser()

    //test exception condition

    testException()
});

function testSameUser() {
    it("same user buy and sell", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()

        let makerOrder = {
            tokenBuy: tokenInstance.address,
            tokenSell: 0,
            user: maker,
            amountBuy: web3.toWei("10", "ether"),
            amountSell: web3.toWei("1", "ether"),
            baseToken: 0,
            expires: 5000000,
            fee: web3.toWei("0.1", "ether"),
            nonce: Date.now(),
            v: 0,
            r: 0,
            s: 0,
            feeToken: 0
        };
        let takerOrder = {
            tokenBuy: 0,
            tokenSell: tokenInstance.address,
            user: maker,
            amountBuy: web3.toWei("1", "ether"),
            amountSell: web3.toWei("10", "ether"),
            baseToken: 0,
            expires: 5000000,
            fee: web3.toWei("0.01", "ether"),
            nonce: Date.now(),
            v: 0,
            r: 0,
            s: 0,
            feeToken: 0
        };
        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        var tradeAmount = web3.toWei("10", "ether")
        let params = genParams(makerOrder, takerOrder, tradeAmount)
        let result = await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})

        assert.equal(result.receipt.status, 1, "trade failed!")

        let balance = await exchangeInstance.balanceOf(0, makerOrder.user)

        exchangeBalance.makerEther = exchangeBalance.makerEther - web3.toDecimal(web3.fromWei(takerOrder.fee))
        assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.makerEther, "maker's eth balance should be [" + exchangeBalance.makerEther + "]!"
        )

        balance = await exchangeInstance.balanceOf(tokenInstance.address, makerOrder.user);
        exchangeBalance.makerRNT = exchangeBalance.makerRNT.valueOf() - web3.toDecimal(web3.fromWei(makerOrder.fee))
        exchangeBalance.makerRNT = new Number(exchangeBalance.makerRNT).toPrecision(3)
        assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.makerRNT, "maker's RNT balance should be [" + exchangeBalance.makerRNT + "]!");

        console.log(exchangeBalance)

    })
}

function testException() {
    let makerOrder = {
        tokenBuy: 0,
        tokenSell: 0,
        user: maker,
        amountBuy: web3.toWei("100", "ether"),
        amountSell: web3.toWei("10", "ether"),
        baseToken: 0,
        expires: 5000000,
        fee: 0,
        nonce: Date.now(),
        v: 0,
        r: 0,
        s: 0,
        feeToken: 0
    };
    let takerOrder = {
        tokenBuy: 0,
        tokenSell: 0,
        user: taker,
        amountBuy: web3.toWei("1", "ether"),
        amountSell: web3.toWei("10", "ether"),
        baseToken: 0,
        expires: 5000000,
        fee: 0,
        nonce: Date.now(),
        v: 0,
        r: 0,
        s: 0,
        feeToken: 0
    };

    it("error check:not same trade pair", async () => {
        //reset
        makerOrder.user = maker

        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        makerOrder.tokenBuy = tokenInstance.address
        takerOrder.tokenSell = maker


        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = genParams(makerOrder, takerOrder, [web3.toWei("10", "ether")])
        await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            .catch((e) => assert.equal(e != null, true, "both order should be the same trade pair"))
    })
    it("error check:submit filled order", async () => {

        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        makerOrder.tokenBuy = tokenInstance.address
        takerOrder.tokenSell = tokenInstance.address


        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = genParams(makerOrder, takerOrder, [web3.toWei("10", "ether")])
        let result = await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
        assert.equal(result.receipt.status, 1, "trade failed!")


        //submit taker order(filled before) again
        await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            .catch((e) => assert.equal(e != null, true, "filled order should not submitted again"))
    })

    it("error check:price not match", async () => {
        //reset
        makerOrder.nonce = Date.now() + 100
        takerOrder.nonce = Date.now() + 100

        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        makerOrder.tokenBuy = tokenInstance.address
        takerOrder.tokenSell = tokenInstance.address


        //change price. seller.price=1>buyer.price=0.1,which can not traded
        takerOrder.amountBuy = web3.toWei("10", "ether")
        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = genParams(makerOrder, takerOrder, [web3.toWei("10", "ether")])
        await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            .catch((e) => assert.equal(e != null, true, "price not match"))

        //reverse taker and maker should trade failed
        params = genParams(takerOrder, makerOrder)
        await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            .catch((e) => assert.equal(e != null, true, "price not match"))

    })

    it("error check:fee too much", async () => {
        //reset
        makerOrder.nonce = Date.now() + 100
        takerOrder.nonce = Date.now() + 100
        takerOrder.amountBuy = web3.toWei("1", "ether")

        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        makerOrder.tokenBuy = tokenInstance.address
        takerOrder.tokenSell = tokenInstance.address

        //set high fee over 1%
        takerOrder.fee = web3.toWei("0.02", "ether")

        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = genParams(makerOrder, takerOrder, [web3.toWei("10", "ether")])
        await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            .catch((e) => assert.equal(e != null, true, "fee over 1%"))


    })
}

function genParams(makerOrder, takerOrder, tradeAmount) {
    var addresses = [
        makerOrder.tokenBuy,
        takerOrder.tokenBuy,
        makerOrder.tokenSell,
        takerOrder.tokenSell,
        makerOrder.user,
        takerOrder.user,
        makerOrder.baseToken,
        takerOrder.baseToken,
        makerOrder.feeToken,
        takerOrder.feeToken,
        feeAccount
    ];
    var values = [
        makerOrder.amountBuy,
        takerOrder.amountBuy,
        makerOrder.amountSell,
        takerOrder.amountSell,
        makerOrder.fee,
        takerOrder.fee,
        makerOrder.expires,
        takerOrder.expires,
        makerOrder.nonce,
        takerOrder.nonce,
        tradeAmount
    ];
    var v = [makerOrder.v, takerOrder.v]
    var r = [makerOrder.r, takerOrder.r]
    var s = [makerOrder.s, takerOrder.s]

    return [addresses, values, v, r, s]
}

async function takerBuy(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, sells, buys, sellOrders, buyOrders, expeted, tradeAmounts) {
    var makerOrders = [], takerOrders = []
    for (let i = 0; i < sellOrders.length; i++) {
        let mo = {
            tokenBuy: sellOrders[i].tokenBuy,
            tokenSell: sellOrders[i].tokenSell,
            user: maker,
            amountBuy: web3.toWei(sellOrders[i].amountBuy),
            amountSell: web3.toWei(sellOrders[i].amountSell),
            baseToken: 0,
            expires: 5000000,
            fee: 0,
            nonce: Date.now(),
            v: 0,
            r: 0,
            s: 0,
            feeToken: 0
        }
        await signOrder(exchangeInstance, mo)
        makerOrders.push(mo)
    }
    // console.log(makerOrders)
    for (let i = 0; i < buyOrders.length; i++) {
        let mo = {
            tokenBuy: buyOrders[i].tokenBuy,
            tokenSell: buyOrders[i].tokenSell,
            user: taker,
            amountBuy: web3.toWei(buyOrders[i].amountBuy),
            amountSell: web3.toWei(buyOrders[i].amountSell),
            baseToken: 0,
            expires: 5000000,
            fee: 0,
            nonce: Date.now(),
            v: 0,
            r: 0,
            s: 0,
            feeToken: 0
        }
        await signOrder(exchangeInstance, mo)
        takerOrders.push(mo)
    }

    ///match orders
    var tradePair = []
    for (let i = 0; i < makerOrders.length; i++) {
        for (let j = 0; j < buys.length; j++) {
            if (sells[i][0] <= buys[j][0]) {
                //price matches
                // if(sellOrders[i].amountSell>=buyOrders[j].amountBuy){
                //amount enough
                tradePair.push([makerOrders[i], takerOrders[j]])
                // }
            }
        }
    }

    // console.log(tradePair)

    ///submit trade on-chain
    var adds = [], vals = [], vs = [], rs = [], ss = [], rns = []
    for (let i = 0; i < tradePair.length; i++) {
        let makerOrder = tradePair[i][0]
        let takerOrder = tradePair[i][1]
        let addresses = [
            makerOrder.tokenBuy,
            takerOrder.tokenBuy,
            makerOrder.tokenSell,
            takerOrder.tokenSell,
            makerOrder.user,
            takerOrder.user,
            0,
            0,
            0,
            0,
            feeAccount
        ];
        let values = [
            makerOrder.amountBuy,
            takerOrder.amountBuy,
            makerOrder.amountSell,
            takerOrder.amountSell,
            makerOrder.fee,
            takerOrder.fee,
            makerOrder.expires,
            takerOrder.expires,
            makerOrder.nonce,
            takerOrder.nonce,
            tradeAmounts[i]
        ];
        let v = [makerOrder.v, takerOrder.v]
        let r = [makerOrder.r, takerOrder.r]
        let s = [makerOrder.s, takerOrder.s]
        // console.log(addresses,values,v,r,s)
        adds.push(addresses)
        vals.push(values)
        vs.push(v)
        rs.push(r)
        ss.push(s)
    }
    let result = await exchangeInstance.batchTrade(adds, vals, vs, rs, ss, {from: admin})
    assert.equal(result.receipt.status, 1, "trade failed!")

    let balance = await exchangeInstance.balanceOf(0, maker)
    exchangeBalance.makerEther = exchangeBalance.makerEther + expeted[0][1];
    assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.makerEther, "maker's eth balance should be [" + exchangeBalance.makerEther + "]!"
    )

    balance = await exchangeInstance.balanceOf(tokenInstance.address, maker);
    exchangeBalance.makerRNT = exchangeBalance.makerRNT + expeted[0][0];
    assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.makerRNT, "maker's RNT balance should be [" + exchangeBalance.makerRNT + "]!");

    balance = await exchangeInstance.balanceOf(0, taker)
    // console.log(exchangeBalance.takerEther,expeted[1][1],(5.1-2))
    exchangeBalance.takerEther = exchangeBalance.takerEther + expeted[1][1];
    assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.takerEther, "taker's eth balance should be [" + exchangeBalance.takerEther + "]!");

    balance = await exchangeInstance.balanceOf(tokenInstance.address, taker);
    exchangeBalance.takerRNT = exchangeBalance.takerRNT + expeted[1][0];
    assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.takerRNT, "taker's RNT balance should be [" + exchangeBalance.takerRNT + "]!");

    console.log(exchangeBalance)
}

async function takerException(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, sells, buys, sellOrders, buyOrders, expeted) {
    // console.log(sellOrders)
    var makerOrders = [], takerOrders = []
    for (let i = 0; i < sellOrders.length; i++) {
        let mo = {
            tokenBuy: sellOrders[i].tokenBuy,
            tokenSell: sellOrders[i].tokenSell,
            user: taker,
            amountBuy: web3.toWei(sellOrders[i].amountBuy),
            amountSell: web3.toWei(sellOrders[i].amountSell),
            expires: 5000000,
            fee: 0,
            nonce: Date.now(),
            v: 0,
            r: 0,
            s: 0
        }
        await signOrder(exchangeInstance, mo)
        makerOrders.push(mo)
    }
    // console.log(makerOrders)
    for (let i = 0; i < buyOrders.length; i++) {
        let mo = {
            tokenBuy: buyOrders[i].tokenBuy,
            tokenSell: buyOrders[i].tokenSell,
            user: maker,
            amountBuy: web3.toWei(buyOrders[i].amountBuy),
            amountSell: web3.toWei(buyOrders[i].amountSell),
            expires: 5000000,
            fee: 0,
            nonce: Date.now(),
            v: 0,
            r: 0,
            s: 0
        }
        await signOrder(exchangeInstance, mo)
        takerOrders.push(mo)
    }

    ///match orders
    var tradePair = []
    for (let i = 0; i < makerOrders.length; i++) {
        for (let j = 0; j < buys.length; j++) {
            if (sells[i][0] <= buys[j][0]) {
                //price matches
                if (sellOrders[i].amountSell >= buyOrders[j].amountBuy) {
                    //amount enough
                    tradePair.push([takerOrders[j], makerOrders[i]])
                }
            }
        }
    }

    console.log(tradePair)

    ///submit trade on-chain
    var adds = [], vals = [], vs = [], rs = [], ss = []
    for (let i = 0; i < tradePair.length; i++) {
        let makerOrder = tradePair[i][0]
        let takerOrder = tradePair[i][1]
        let addresses = [
            makerOrder.tokenBuy,
            takerOrder.tokenBuy,
            makerOrder.tokenSell,
            takerOrder.tokenSell,
            makerOrder.user,
            takerOrder.user
        ];
        let values = [
            makerOrder.amountBuy,
            takerOrder.amountBuy,
            makerOrder.amountSell,
            takerOrder.amountSell,
            makerOrder.fee,
            takerOrder.fee,
            makerOrder.expires,
            takerOrder.expires,
            makerOrder.nonce,
            takerOrder.nonce
        ];
        let v = [makerOrder.v, takerOrder.v]
        let r = [makerOrder.r, takerOrder.r]
        let s = [makerOrder.s, takerOrder.s]
        // console.log(addresses,values,v,r,s)
        adds.push(addresses)
        vals.push(values)
        vs.push(v)
        rs.push(r)
        ss.push(s)
    }
    let result = await exchangeInstance.batchTrade(adds, vals, vs, rs, ss)
    assert.equal(result.receipt.status, 1, "trade failed!")

}

async function takerSell(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, sells, buys, sellOrders, buyOrders, expeted, tradeAmounts) {
    // console.log(sellOrders)
    var makerOrders = [], takerOrders = []
    for (let i = 0; i < sellOrders.length; i++) {
        let mo = {
            tokenBuy: sellOrders[i].tokenBuy,
            tokenSell: sellOrders[i].tokenSell,
            user: taker,
            amountBuy: web3.toWei(sellOrders[i].amountBuy),
            amountSell: web3.toWei(sellOrders[i].amountSell),
            baseToken: '0x0',
            expires: 5000000,
            fee: 0,
            nonce: Date.now(),
            v: 0,
            r: 0,
            s: 0,
            feeToken: 0
        }
        await signOrder(exchangeInstance, mo)
        makerOrders.push(mo)
    }
    // console.log(makerOrders)
    for (let i = 0; i < buyOrders.length; i++) {
        let mo = {
            tokenBuy: buyOrders[i].tokenBuy,
            tokenSell: buyOrders[i].tokenSell,
            user: maker,
            amountBuy: web3.toWei(buyOrders[i].amountBuy),
            amountSell: web3.toWei(buyOrders[i].amountSell),
            baseToken: 0,
            expires: 5000000,
            fee: 0,
            nonce: Date.now(),
            v: 0,
            r: 0,
            s: 0,
            feeToken: 0
        }
        await signOrder(exchangeInstance, mo)
        takerOrders.push(mo)
    }

    ///match orders
    var tradePair = []
    for (let i = 0; i < makerOrders.length; i++) {
        for (let j = 0; j < buys.length; j++) {
            if (sells[i][0] <= buys[j][0]) {
                //price matches
                // if(sellOrders[i].amountSell>=buyOrders[j].amountBuy){
                //amount enough
                tradePair.push([takerOrders[j], makerOrders[i]])
                // }
            }
        }
    }

    // console.log(tradePair)

    ///submit trade on-chain
    var adds = [], vals = [], vs = [], rs = [], ss = [], rnts = []
    for (let i = 0; i < tradePair.length; i++) {
        let makerOrder = tradePair[i][0]
        let takerOrder = tradePair[i][1]
        let addresses = [
            makerOrder.tokenBuy,
            takerOrder.tokenBuy,
            makerOrder.tokenSell,
            takerOrder.tokenSell,
            makerOrder.user,
            takerOrder.user,
            0,
            0,
            0,
            0,
            feeAccount
        ];
        let values = [
            makerOrder.amountBuy,
            takerOrder.amountBuy,
            makerOrder.amountSell,
            takerOrder.amountSell,
            makerOrder.fee,
            takerOrder.fee,
            makerOrder.expires,
            takerOrder.expires,
            makerOrder.nonce,
            takerOrder.nonce,
            tradeAmounts[i]
        ];
        let v = [makerOrder.v, takerOrder.v]
        let r = [makerOrder.r, takerOrder.r]
        let s = [makerOrder.s, takerOrder.s]
        // console.log(addresses,values,v,r,s)
        adds.push(addresses)
        vals.push(values)
        vs.push(v)
        rs.push(r)
        ss.push(s)
    }
    let result = await exchangeInstance.batchTrade(adds, vals, vs, rs, ss, {from: admin})
    assert.equal(result.receipt.status, 1, "trade failed!")

    let balance = await exchangeInstance.balanceOf(0, maker)
    exchangeBalance.makerEther = exchangeBalance.makerEther + expeted[1][1];
    assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.makerEther, "maker's eth balance should be [" + exchangeBalance.makerEther + "]!"
    )

    balance = await exchangeInstance.balanceOf(tokenInstance.address, maker);
    exchangeBalance.makerRNT = exchangeBalance.makerRNT + expeted[1][0];
    assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.makerRNT, "maker's RNT balance should be [" + exchangeBalance.makerRNT + "]!");

    balance = await exchangeInstance.balanceOf(0, taker)
    exchangeBalance.takerEther = exchangeBalance.takerEther + expeted[0][1];
    assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.takerEther, "taker's eth balance should be [" + exchangeBalance.takerEther + "]!");

    balance = await exchangeInstance.balanceOf(tokenInstance.address, taker);
    exchangeBalance.takerRNT = exchangeBalance.takerRNT + expeted[0][0];
    assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.takerRNT, "taker's RNT balance should be [" + exchangeBalance.takerRNT + "]!");

    // let buyOrderFilled=await exchangeInstance.buyOrderFilled(taker,makerOrders[0].hash,);
    // console.log("buyOrderFilled:",web3.fromWei(buyOrderFilled.valueOf()))
    console.log(exchangeBalance)
}

async function signOrder(exchangeInstance, mo) {
    let hash = await exchangeInstance.getOrderHash(mo.tokenBuy, mo.amountBuy, mo.tokenSell, mo.amountSell, mo.baseToken, mo.expires, mo.nonce, mo.feeToken)
    var signed = web3.eth.sign(mo.user, hash);
    orderSigned = signed.substring(2, signed.length);
    mo.r = "0x" + orderSigned.slice(0, 64);
    mo.s = "0x" + orderSigned.slice(64, 128);
    mo.v = web3.toDecimal(orderSigned.slice(128, 130)) + 27;
    mo.hash = hash;
}


function testTrade(topic, makerOrder, takerOrder) {
    it(topic, async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        makerOrder.tokenBuy = tokenInstance.address;
        takerOrder.tokenSell = tokenInstance.address;
        takerOrder.feeToken = tokenInstance.address
        var tradeAmount = web3.toWei("10", "ether")

        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = genParams(makerOrder, takerOrder, tradeAmount)

        let result = await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
        assert.equal(result.receipt.status, 1, "trade failed!")
        console.log("gasUsed:", result.receipt.gasUsed)

        let balance = await exchangeInstance.balanceOf(0, makerOrder.user)
        exchangeBalance.makerEther = exchangeBalance.makerEther - web3.toDecimal(web3.fromWei(takerOrder.amountBuy));
        assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.makerEther, "maker's eth balance should be [" + exchangeBalance.makerEther + "]!"
        )

        balance = await exchangeInstance.balanceOf(tokenInstance.address, makerOrder.user);
        exchangeBalance.makerRNT = exchangeBalance.makerRNT + web3.toDecimal(web3.fromWei(takerOrder.amountSell)) - web3.toDecimal(web3.fromWei(makerOrder.fee));
        assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.makerRNT, "maker's RNT balance should be [" + exchangeBalance.makerRNT + "]!");

        balance = await exchangeInstance.balanceOf(0, takerOrder.user)
        exchangeBalance.takerEther = exchangeBalance.takerEther + web3.toDecimal(web3.fromWei(takerOrder.amountBuy));
        assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.takerEther, "taker's eth balance should be [" + exchangeBalance.takerEther + "]!");

        balance = await exchangeInstance.balanceOf(tokenInstance.address, takerOrder.user);
        exchangeBalance.takerRNT = exchangeBalance.takerRNT - web3.toDecimal(web3.fromWei(takerOrder.amountSell)) - web3.toDecimal(web3.fromWei(takerOrder.fee));
        assert.equal(web3.fromWei(balance.valueOf()), exchangeBalance.takerRNT, "taker's RNT balance should be [" + exchangeBalance.takerRNT + "]!");

        balance = await exchangeInstance.balanceOf(tokenInstance.address, feeAccount)
        let exp = web3.toDecimal(web3.fromWei(makerOrder.fee)) + web3.toDecimal(web3.fromWei(takerOrder.fee))
        assert.equal(web3.fromWei(balance.valueOf()), exp, "feeAccount's RNT balance should be [" + exp + "]!")
        console.log(exchangeBalance)

    })
}

function testTradeNotMatch(topic, makerOrder, takerOrder) {
    it(topic, async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()
        makerOrder.amountSell = web3.toWei("1", "ether");
        makerOrder.amountBuy = web3.toWei("100", "ether");
        takerOrder.amountSell = web3.toWei("10", "ether");
        takerOrder.amountBuy = web3.toWei("0.2", "ether");
        let hash = await exchangeInstance.getOrderHash(makerOrder.tokenBuy, makerOrder.amountBuy, makerOrder.tokenSell, makerOrder.amountSell, 0, makerOrder.expires, makerOrder.nonce, makerOrder.feeToken)

        var signed = web3.eth.sign(makerOrder.user, hash);
        orderSigned = signed.substring(2, signed.length);
        makerOrder.r = "0x" + orderSigned.slice(0, 64);
        makerOrder.s = "0x" + orderSigned.slice(64, 128);
        makerOrder.v = web3.toDecimal(orderSigned.slice(128, 130)) + 27;
        hash = await exchangeInstance.getOrderHash(takerOrder.tokenBuy, takerOrder.amountBuy, takerOrder.tokenSell, takerOrder.amountSell, 0, takerOrder.expires, takerOrder.nonce, takerOrder.feeToken)
        var signed = web3.eth.sign(takerOrder.user, hash);
        orderSigned = signed.substring(2, signed.length);
        takerOrder.r = "0x" + orderSigned.slice(0, 64);
        takerOrder.s = "0x" + orderSigned.slice(64, 128);
        takerOrder.v = web3.toDecimal(orderSigned.slice(128, 130)) + 27;
        var addresses = [
            makerOrder.tokenBuy,
            takerOrder.tokenBuy,
            makerOrder.tokenSell,
            takerOrder.tokenSell,
            makerOrder.user,
            takerOrder.user,
            0,
            0,
            0,
            0,
            feeAccount
        ];
        var values = [
            makerOrder.amountBuy,
            takerOrder.amountBuy,
            makerOrder.amountSell,
            takerOrder.amountSell,
            makerOrder.fee,
            takerOrder.fee,
            makerOrder.expires,
            takerOrder.expires,
            makerOrder.nonce,
            takerOrder.nonce
        ];
        var v = [makerOrder.v, takerOrder.v]
        var r = [makerOrder.r, takerOrder.r]
        var s = [makerOrder.s, takerOrder.s]
        exchangeInstance.trade(addresses, values, v, r, s, {from: admin}).catch((e) => assert.equal(e != null, true, "this rate should not be traded!"))

    })
}

