var RNTToken = artifacts.require("HumanStandardToken"); //token contract
var Exchange = artifacts.require("R1Exchange"); // real exchange contract
var sleep = require('sleep');
var Data = require('./util/Data')
var Order=require('./util/Order')
var Log = require('../util/LogConsole')
var JsonUtils = require('../util/JsonUtils')
var abi = require('ethereumjs-abi')
var printData = false;
var exchangeBalance = {
    makerEther: 0,
    makerRNT: 0,
    takerEther: 0,
    takerRNT: 0
};

var DEFAULT_CHANNEL_ID = 0

var tokenInstance, exchangeInstance, owner, admin, maker, taker, feeAccount, channel1FeeAccount, channel2FeeAccount, channel1Id, channel2Id

contract("Exchange", function (accounts) {

    tokenInstance;
    exchangeInstance;
    owner = accounts[0]
    admin = accounts[1]
    maker = accounts[2]
    taker = accounts[3]
    feeAccount = accounts[5]
    channel1FeeAccount = accounts[6]
    channel2FeeAccount = accounts[7]
    channel1Id = 100
    channel2Id = 101

    Log.debug('owner:', owner);
    Log.debug('admin:', admin);
    Log.debug('maker:', maker);
    Log.debug('taker:', taker);
    Log.debug('feeAccount:', feeAccount);
    Log.debug('channel1FeeAccount:', channel1FeeAccount);
    Log.debug('channel2FeeAccount:', channel2FeeAccount);


    let balance
    let result

    let initEth = 100;
    let initRNT = 10000;
    let takerRNTBalance = initRNT + 1000;

    beforeEach(async () => {
        tokenInstance = await RNTToken.deployed()
        exchangeInstance = await Exchange.deployed()
        assert.ok(tokenInstance)
        assert.ok(exchangeInstance)

        let result = await tokenInstance.enableTransfer(true, {from: owner})
        assert.equal(result.receipt.status, 1, " enable transfer failed")
        result = await exchangeInstance.setAdmin(admin, true, {from: owner})
        // assert.equal(result.receipt.status, 1, " setAdmin failed!")
        result = await exchangeInstance.setFeeAccount(feeAccount, true, {from: owner})
        // assert.equal(result.receipt.status, 1, " setFeeAccount failed!")
    })

    afterEach(async () => {

    })

    it("init token:supply should be 400000000 !", async () => {
        let balance = await tokenInstance.balanceOf.call(owner)
        assert.equal(web3.fromWei(balance.valueOf()), 400000000, "400000000 wasn't the initial supply");
    })

    it("set admins and RNT contract!", async () => {
        let result = await exchangeInstance.setAdmin(admin, true, {from: owner})
        assert.equal(result.receipt.status, 1, " setAdmin failed!")
    })

    it("set feeAccount!", async () => {
        let result = await exchangeInstance.setFeeAccount(feeAccount, true, {from: owner})
        assert.equal(result.receipt.status, 1, " setFeeAccount failed!")
    })



    it("deposit ether and token:", async () => {
        let tokenInstance = await RNTToken.deployed()
        let exchangeInstance = await Exchange.deployed()


        await exchangeInstance.deposit(channel1Id, {value: web3.toWei(initEth, "ether"),from: maker})
        balance = await exchangeInstance.balanceOf(0, maker, channel1Id)
        Log.debug('maker balance:', web3.fromWei(balance.valueOf()))
        assert.equal(web3.fromWei(balance.valueOf()), initEth, "maker deposit " + initEth + " ether failed!")
        exchangeBalance.makerEther = initEth

        await exchangeInstance.deposit(channel2Id, {value: web3.toWei(initEth, "ether"),from: taker})
        balance = await exchangeInstance.balanceOf(0, taker, channel2Id)
        Log.debug('taker balance:', web3.fromWei(balance.valueOf()))
        assert.equal(web3.fromWei(balance.valueOf()), initEth, "taker deposit " + initEth + " ether failed!")
        exchangeBalance.takerEther = initEth

        await tokenInstance.transfer(maker, web3.toWei(takerRNTBalance, "ether"), {from: owner})
        await tokenInstance.approve(exchangeInstance.address, web3.toWei(1000000000000, "ether"), {from: maker})
        balance = await tokenInstance.allowance(maker, exchangeInstance.address)
        assert.equal(web3.fromWei(balance.valueOf()), 1000000000000, "approve failed")
        result = await exchangeInstance.depositToken(tokenInstance.address, web3.toWei(initRNT, "ether"), channel1Id, {from: maker})
        Log.debug('maker balance:', web3.fromWei(balance.valueOf()), tokenInstance.address)
        assert.equal(result.receipt.status, 1, "maker deposit rnt failed");
        exchangeBalance.makerRNT = initRNT

        await tokenInstance.transfer(taker, web3.toWei(takerRNTBalance, "ether"), {from: owner})
        await tokenInstance.approve(exchangeInstance.address, web3.toWei(1000000000000, "ether"), {from: taker})
        balance = await tokenInstance.allowance(taker, exchangeInstance.address)
        assert.equal(web3.fromWei(balance.valueOf()), 1000000000000, "approve failed")
        result = await exchangeInstance.depositToken(tokenInstance.address, web3.toWei(initRNT, "ether"), channel2Id, {from: taker})
        Log.debug('taker balance:', web3.fromWei(balance.valueOf()), tokenInstance.address)
        assert.equal(result.receipt.status, 1, "taker deposit rnt failed");
        exchangeBalance.takerRNT = initRNT

    })

    it("depositTo", async () => {
        let amount = 1
        await tokenInstance.transfer(taker, web3.toWei(takerRNTBalance, "ether"), {from: owner})
        await tokenInstance.approve(exchangeInstance.address, web3.toWei(1000000000000, "ether"), {from: taker})
        let beforeBalance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('before balance:', web3.fromWei(beforeBalance.valueOf()), tokenInstance.address)
        let result = await exchangeInstance.batchDepositTo([tokenInstance.address], [maker], [web3.toWei(amount, "ether")], channel1Id, {from: taker})
        assert.equal(result.receipt.status, 1, "taker deposit rnt to maker failed")
        let afterBalance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('after balance:', web3.fromWei(afterBalance.valueOf()), tokenInstance.address)
        assert.equal(web3.fromWei(afterBalance.valueOf()), web3.fromWei(beforeBalance.valueOf())*1 + amount*1, "taker deposit rnt to maker failed")
    })

    it("transferTo", async () => {
        let amount = 1
        let makerBeforeBalance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('maker before balance:', web3.fromWei(makerBeforeBalance.valueOf()), tokenInstance.address)
        let takerBeforeBalance = await exchangeInstance.balanceOf(tokenInstance.address, taker, channel1Id)
        Log.debug('taker before balance:', web3.fromWei(takerBeforeBalance.valueOf()), tokenInstance.address)

        try {
            let result = await exchangeInstance.batchTransferTo([tokenInstance.address], [taker], [web3.toWei(amount, "ether")], channel1Id, {from: maker})
            Log.debug('logs:',result.receipt.logs)
            Log.debug('status:', result.receipt.status)
            assert.equal(result.receipt.status, 1, "maker transferTo rnt to taker failed")
        } catch (e) {
            Log.error('batchTransferTo', e)
        }

        let makerAfterBalance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('maker after balance:', web3.fromWei(makerAfterBalance.valueOf()), tokenInstance.address)
        let takerAfterBalance = await exchangeInstance.balanceOf(tokenInstance.address, taker, channel1Id)
        Log.debug('taker after balance:', web3.fromWei(takerAfterBalance.valueOf()), tokenInstance.address)

        assert.equal(web3.fromWei(makerAfterBalance.valueOf())*1, web3.fromWei(makerBeforeBalance.valueOf())*1 - amount, "maker balance error, maker transferTo rnt to taker failed")
        assert.equal(web3.fromWei(takerAfterBalance.valueOf())*1, web3.fromWei(takerBeforeBalance.valueOf())*1 + amount, "taker balance error, maker transferTo rnt to taker failed")
    })

    it("adminWithdraw", async () => {
        Log.debug('adminWithdraw hash:', [exchangeInstance.address, taker, tokenInstance.address, web3.toWei("1", "ether"), 11, feeAccount, channel2FeeAccount, channel2Id])
        hash = "0x" + abi.soliditySHA3(["address", "address", "address", "uint256", "uint256", "address", "address", "uint256"],
            [exchangeInstance.address, taker, tokenInstance.address, web3.toWei("1", "ether"), 11, feeAccount, channel2FeeAccount, channel2Id]
        ).toString("hex")
        Log.debug("=========", hash)
        var signed = web3.eth.sign(taker, hash);
        orderSigned = signed.substring(2, signed.length);
        r = "0x" + orderSigned.slice(0, 64);
        s = "0x" + orderSigned.slice(64, 128);
        v = web3.toDecimal(orderSigned.slice(128, 130)) + 27;
        balance = await exchangeInstance.balanceOf(tokenInstance.address, taker, channel2Id)
        Log.debug('balance before:', web3.fromWei(balance.valueOf()));
        result = await exchangeInstance.adminWithdraw([taker, tokenInstance.address, feeAccount, channel2FeeAccount], [web3.toWei("1", "ether"), 11, 0, 0, channel2Id], v, r, s, {from: admin})
        balance = await exchangeInstance.balanceOf(tokenInstance.address, taker, channel2Id)
        Log.debug('balance after:', web3.fromWei(balance.valueOf()));
        assert.equal(result.receipt.status, 1, "adminWithdraw failed!")
    })

    it("refund", async () => {
        await tokenInstance.approve(exchangeInstance.address, web3.toWei(1000000000000, "ether"), {from: maker})
        await tokenInstance.transfer(maker, web3.toWei(500, "ether"), {from: owner})

        await exchangeInstance.deposit(channel1Id, {value: web3.toWei(1, "ether"),from: maker})
        await exchangeInstance.depositToken(tokenInstance.address, web3.toWei(10, "ether"), channel1Id, {from: maker})
        await exchangeInstance.depositToken(tokenInstance.address, web3.toWei(10, "ether"), channel2Id, {from: maker})

        balance = await exchangeInstance.balanceOf(0, maker, channel1Id)
        Log.debug('eth before balance refund:', web3.fromWei(balance.valueOf()));
        assert.equal(balance.valueOf()>0, true, "eth refund channel1Id failed!")

        balance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('token before balance refund:', web3.fromWei(balance.valueOf()))
        assert.equal(balance.valueOf()>0, true, "token refund channel1Id failed!")

        balance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel2Id)
        Log.debug('eth before balance refund:', web3.fromWei(balance.valueOf()));
        assert.equal(balance.valueOf()>0, true, "token refund channel2Id failed!")


        result = await exchangeInstance.refund(maker, [0, tokenInstance.address,tokenInstance.address],[channel1Id, channel1Id, channel2Id], {from: admin})
        // Log.debug('result:', result);
        assert.equal(result.receipt.status, 1, "refund failed");


        balance = await exchangeInstance.balanceOf(0, maker, channel1Id)
        Log.debug('eth after balance refund:', web3.fromWei(balance.valueOf()));
        assert.equal(web3.fromWei(balance.valueOf()), 0, "eth refund channel1Id failed!")

        balance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('token after balance refund:', web3.fromWei(balance.valueOf()))
        assert.equal(web3.fromWei(balance.valueOf()), 0, "token refund channel1Id failed!")

        balance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel2Id)
        Log.debug('eth after balance refund:', web3.fromWei(balance.valueOf()));
        assert.equal(web3.fromWei(balance.valueOf()), 0, "token refund channel2Id failed!")

    })

    testTrade();
    
    testTradeException()
    //

});

function testTrade() {

    it("trade:sell1*sell2 = buy1*buy2", async () => {
        let pair = {
            baseToken: 0,
            token: tokenInstance.address
        }
        let makerOrder = {
            tokenBuy: pair.token,
            tokenSell: pair.baseToken,
            user: maker,
            amountBuy: web3.toWei("10", "ether"),
            amountSell: web3.toWei("1", "ether"),
            baseToken: "0x0",
            expires: 5000000,
            fee: web3.toWei("0.1", "ether"),
            nonce: Date.now(),
            feeToken: 0,
            channelFeeAccount : channel1FeeAccount,
            channelFee: web3.toWei("0.1", "ether"),
            channelId: channel1Id,
            v: 0,
            r: 0,
            s: 0
        };
        let takerOrder = {
            tokenBuy: pair.baseToken,
            tokenSell: pair.token,
            user: taker,
            amountBuy: web3.toWei("1", "ether"),
            amountSell: web3.toWei("10", "ether"),
            baseToken: "0x0",
            expires: 5000000,
            fee: web3.toWei("0.1", "ether"),
            nonce: Date.now(),
            feeToken: 0,
            channelFeeAccount : channel2FeeAccount,
            channelFee: web3.toWei("0.1", "ether"),
            channelId: channel2Id,
            v: 0,
            r: 0,
            s: 0
        };

        // takerOrder.feeToken = tokenInstance.address
        let tradeAmount = web3.toWei("10", "ether")

        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = Order.genParams(makerOrder, takerOrder, tradeAmount, feeAccount)

        await depositForTrade(exchangeInstance, tokenInstance, maker, taker, channel1Id, channel2Id);

        // get balance before trade
        let beforeBalance = await getBalanceForTrade(exchangeInstance, makerOrder, takerOrder, pair, feeAccount)

        Log.trace('addresses:',params[0])
        Log.trace('values:',params[1])
        Log.trace('v:',params[2])
        Log.trace('r:',params[3])
        Log.trace('s:',params[4])
        //trade
        try {
            let result = await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            console.log('trade logs:', result.receipt.logs)
            assert.equal(result.receipt.status, 1, "trade failed!")
            Log.debug("gasUsed:", result.receipt.gasUsed)
        }catch (e) {
            Log.debug('trade err:', e)
        }


        // get balance after trade
        let afterBalance = await getBalanceForTrade(exchangeInstance, makerOrder, takerOrder, pair, feeAccount)

    })


    it("test equal price", async () => {
        let src = "./test/data/data.csv"
        let res = await Data.readData(src, 0, tokenInstance.address, printData)
        await bacthTrade(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether"), web3.toWei("20", "ether")])
    })

    it("taker sell :takerAmount<=makerAmount", async () => {
        let src = "./test/data/data_taker_sell_2.csv"
        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await bacthTrade(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether")])
    })

    it("taker sell :takerAmount>makerAmount ", async () => {
        let src = "./test/data/data_taker_sell_1.csv"
        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await bacthTrade(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether")])

    })

    it("taker sell :buy remain <0 ", async () => {
        let src = "./test/data/data_taker_sell_3.csv"
        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await bacthTrade(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("15", "ether"), web3.toWei("10", "ether")])

    })

    it("taker sell :multi sell  ", async () => {
        let src = "./test/data/data_taker_sell_4.csv"
        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await bacthTrade(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether"), web3.toWei("10", "ether")])

    })

    it("taker buy：takerAmount<=makerAmount ", async () => {
        let src = "./test/data/data_taker_buy_1.csv"
        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await bacthTrade(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether")])

    })

    it("taker buy ：takerAmount>makerAmount ", async () => {
        let src = "./test/data/data_taker_buy_2.csv"
        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await bacthTrade(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether")])

    })

    it("taker buy ：multi sell ", async () => {
        let src = "./test/data/data_taker_buy_3.csv"
        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await bacthTrade(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether"), web3.toWei("10", "ether")])

    })

    it("test full", async () => {
        let src = "./test/data/data_full.csv"
        let res = await Data.readData(src, "0x0", tokenInstance.address, printData)
        await bacthTrade(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, res.sells, res.buys, res.sellOrders, res.buyOrders, res.expeted, [web3.toWei("10", "ether"), web3.toWei("10", "ether")])
    })

    it("same user buy and sell", async () => {
        let pair = {
            baseToken: 0,
            token: tokenInstance.address
        }
        let makerOrder = {
            tokenBuy: pair.token,
            tokenSell: pair.baseToken,
            user: maker,
            amountBuy: web3.toWei("10", "ether"),
            amountSell: web3.toWei("1", "ether"),
            baseToken: 0,
            expires: 5000000,
            fee: web3.toWei("0.1", "ether"),
            nonce: Date.now(),
            feeToken: 0,
            channelFeeAccount : channel1FeeAccount,
            channelFee: web3.toWei("0.15", "ether"),
            channelId: channel1Id,
            v: 0,
            r: 0,
            s: 0
        };
        let takerOrder = {
            tokenBuy: pair.baseToken,
            tokenSell: pair.token,
            user: maker,
            amountBuy: web3.toWei("1", "ether"),
            amountSell: web3.toWei("10", "ether"),
            baseToken: 0,
            expires: 5000000,
            fee: web3.toWei("0.01", "ether"),
            nonce: Date.now(),
            feeToken: 0,
            channelFeeAccount : channel2FeeAccount,
            channelFee: web3.toWei("0.15", "ether"),
            channelId: channel1Id,
            v: 0,
            r: 0,
            s: 0
        };


        let tradeAmount = web3.toWei("10", "ether")

        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = Order.genParams(makerOrder, takerOrder, tradeAmount, feeAccount)

        await depositForTrade(exchangeInstance, tokenInstance, maker, taker, channel1Id, channel1Id);

        // get balance before trade
        Log.debug('beforeBalance:')
        let beforeBalance = await getBalanceForTrade(exchangeInstance, makerOrder, takerOrder, pair, feeAccount)

        Log.trace('addresses:',params[0])
        Log.trace('values:',params[1])
        Log.trace('v:',params[2])
        Log.trace('r:',params[3])
        Log.trace('s:',params[4])
        //trade
        try {
            let result = await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            console.log('trade logs:', result.receipt.logs)
            assert.equal(result.receipt.status, 1, "trade failed!")
            Log.debug("gasUsed:", result.receipt.gasUsed)
        }catch (e) {
            Log.debug('trade err:', e)
        }


        // get balance after trade
        Log.debug('afterBalance:')
        let afterBalance = await getBalanceForTrade(exchangeInstance, makerOrder, takerOrder, pair, feeAccount)

    })

    it("cancel order", async () => {
        let ram = Date.now()
        let makerOrder = {
            tokenBuy: tokenInstance.address,
            tokenSell: 0,
            user: taker,
            amountBuy: web3.toWei("5", "ether"),
            amountSell: web3.toWei("1", "ether"),
            baseToken: 0,
            expires: 5000000,
            fee: web3.toWei("0.1", "ether"),
            nonce: ram,
            feeToken: 0,
            channelFeeAccount : channel1FeeAccount,
            channelFee: web3.toWei("0.15", "ether"),
            channelId: channel1Id,
            v: 0,
            r: 0,
            s: 0
        };
        let takerOrder = {
            tokenBuy: 0,
            tokenSell: tokenInstance.address,
            user: maker,
            amountBuy: web3.toWei("1", "ether"),
            amountSell: web3.toWei("5", "ether"),
            baseToken: 0,
            expires: 5000000,
            fee: web3.toWei("0.01", "ether"),
            nonce: ram,
            feeToken: 0,
            channelFeeAccount : channel1FeeAccount,
            channelFee: web3.toWei("0.15", "ether"),
            channelId: channel1Id,
            v: 0,
            r: 0,
            s: 0
        };

        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        var tradeAmount = web3.toWei("5", "ether")

        //cancel this order
        await exchangeInstance.batchCancel([taker], [ram], channel1Id, {from: admin})
        // Log.debug("nonce", ram)
        let params = Order.genParams(makerOrder, takerOrder, tradeAmount)
        await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            .catch((e) => assert.equal(e != null, true, "both order should be the same trade pair"))

    })

}


function testTradeException() {

    it("BugBH:", async () => {
        //bug:taker buy完全匹配多个maker sell的订单,交易失败
        //taker buy tokens to match many maker
        let pair = {
            baseToken: 0,
            token: tokenInstance.address
        }
        let ram = Date.now()
        let makerOrder = {
            tokenBuy: 0,
            tokenSell: tokenInstance.address,
            user: maker,
            amountBuy: web3.toWei("0.8", "ether"),
            amountSell: web3.toWei("10", "ether"),
            baseToken: 0,
            expires: 5000000,
            fee: web3.toWei("0.01", "ether"),
            nonce: ram,
            feeToken: 0,
            channelFeeAccount : channel1FeeAccount,
            channelFee: web3.toWei("0.15", "ether"),
            channelId: channel1Id,
            v: 0,
            r: 0,
            s: 0
        };
        let makerOrder2 = {
            tokenBuy: 0,
            tokenSell: tokenInstance.address,
            user: maker,
            amountBuy: web3.toWei("0.5", "ether"),
            amountSell: web3.toWei("10", "ether"),
            baseToken: 0,
            expires: 5000000,
            fee: web3.toWei("0.01", "ether"),
            nonce: ram + 1009,
            feeToken: 0,
            channelFeeAccount : channel1FeeAccount,
            channelFee: web3.toWei("0.15", "ether"),
            channelId: channel1Id,
            v: 0,
            r: 0,
            s: 0
        };
        let takerOrder = {
            tokenBuy: tokenInstance.address,
            tokenSell: 0,
            user: taker,
            amountBuy: web3.toWei("20", "ether"),
            amountSell: web3.toWei("2", "ether"),
            baseToken: 0,
            expires: 5000000,
            fee: web3.toWei("0.002", "ether"),
            nonce: ram,
            feeToken: 0,
            channelFeeAccount : channel1FeeAccount,
            channelFee: web3.toWei("0.15", "ether"),
            channelId: channel1Id,
            v: 0,
            r: 0,
            s: 0
        };

        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, makerOrder2)
        await signOrder(exchangeInstance, takerOrder)
        var tradeAmount = web3.toWei("10", "ether")

        await depositForTrade(exchangeInstance, tokenInstance, maker, taker, channel1Id, channel1Id);
        let beforeBalance, afterBalance

        let params = Order.genParams(makerOrder, takerOrder, tradeAmount, feeAccount)
        // get balance before trade
        Log.debug('beforeBalance')
        beforeBalance = await getBalanceForTrade(exchangeInstance, makerOrder, takerOrder, pair, feeAccount)

        let result = await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
        assert.equal(result.receipt.status, 1, "trade1 failed!")
        Log.debug("gasUsed:", result.receipt.gasUsed)

        // get balance after trade
        Log.debug('beforeBalance')
        afterBalance = await getBalanceForTrade(exchangeInstance, makerOrder, takerOrder, pair, feeAccount)



        params = Order.genParams(makerOrder2, takerOrder, tradeAmount, feeAccount)
        // get balance before trade
        Log.debug('beforeBalance')
        beforeBalance = await getBalanceForTrade(exchangeInstance, makerOrder2, takerOrder, pair, feeAccount)

        result = await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
        assert.equal(result.receipt.status, 1, "trade2 failed!")
        Log.debug("gasUsed:", result.receipt.gasUsed)

        // get balance after trade
        Log.debug('beforeBalance')
        afterBalance = await getBalanceForTrade(exchangeInstance, makerOrder2, takerOrder, pair, feeAccount)

    })


    let ram = Date.now()
    let makerOrder = {
        tokenBuy: 0,
        tokenSell: 0,
        user: maker,
        amountBuy: web3.toWei("100", "ether"),
        amountSell: web3.toWei("10", "ether"),
        baseToken: 0,
        expires: 5000000,
        fee: 0,
        nonce: ram,
        feeToken: 0,
        channelFeeAccount : channel1FeeAccount,
        channelFee: web3.toWei("0.05", "ether"),
        channelId: channel1Id,
        v: 0,
        r: 0,
        s: 0
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
        nonce: ram,
        feeToken: 0,
        channelFeeAccount : channel1FeeAccount,
        channelFee: web3.toWei("0.05", "ether"),
        channelId: channel1Id,
        v: 0,
        r: 0,
        s: 0
    };


    // Log.debug("exp nonce", ram)

    it("error check:not same trade pair", async () => {
        //reset
        makerOrder.user = maker
        makerOrder.tokenBuy = tokenInstance.address
        takerOrder.tokenSell = maker

        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = Order.genParams(makerOrder, takerOrder, web3.toWei("10", "ether"), feeAccount)

        await depositForTrade(exchangeInstance, tokenInstance, maker, taker, channel1Id, channel1Id);

        await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            .catch((e) => assert.equal(e != null, true, "both order should be the same trade pair"))
    })

    it("error check:submit filled order", async () => {

        makerOrder.tokenBuy = tokenInstance.address
        takerOrder.tokenSell = tokenInstance.address

        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = Order.genParams(makerOrder, takerOrder, web3.toWei("10", "ether"), feeAccount)

        await depositForTrade(exchangeInstance, tokenInstance, maker, taker, channel1Id, channel1Id);


        try {
            let result = await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            assert.equal(result.receipt.status, 1, "trade failed!")
        } catch(e) {
            Log.debug('error 1:', e)
        }


        //submit taker order(filled before) again
        try {
            let res = await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            Log.debug('status:', res.receipt.status)
        } catch(e) {
            Log.debug('error 2:', e)
            assert.equal(e != null, true, "filled order should not submitted again")
        }

    })

    it("error check:price not match", async () => {
        //reset
        makerOrder.nonce = Date.now() + 100
        takerOrder.nonce = Date.now() + 100

        makerOrder.tokenBuy = tokenInstance.address
        takerOrder.tokenSell = tokenInstance.address


        //change price. seller.price=1>buyer.price=0.1,which can not traded
        takerOrder.amountBuy = web3.toWei("10", "ether")
        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = Order.genParams(makerOrder, takerOrder, web3.toWei("10", "ether"), feeAccount)

        await depositForTrade(exchangeInstance, tokenInstance, maker, taker, channel1Id, channel1Id);

        await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            .catch((e) => assert.equal(e != null, true, "price not match"))

        //reverse taker and maker should trade failed
        params = Order.genParams(takerOrder, makerOrder)
        await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            .catch((e) => assert.equal(e != null, true, "price not match"))

    })

    it("error check:fee too much", async () => {
        //reset
        makerOrder.nonce = Date.now() + 100
        takerOrder.nonce = Date.now() + 100
        takerOrder.amountBuy = web3.toWei("1", "ether")

        makerOrder.tokenBuy = tokenInstance.address
        takerOrder.tokenSell = tokenInstance.address

        //set high fee over 1%
        takerOrder.fee = web3.toWei("0.02", "ether")

        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = Order.genParams(makerOrder, takerOrder, web3.toWei("10", "ether"), feeAccount)

        await depositForTrade(exchangeInstance, tokenInstance, maker, taker, channel1Id, channel1Id);

        await exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin})
            .catch((e) => assert.equal(e != null, true, "fee over 1%"))


    })

    it("no match trade: sell1*sell2<buy1*buy2", async () => {
        makerOrder.amountSell = web3.toWei("1", "ether");
        makerOrder.amountBuy = web3.toWei("100", "ether");
        takerOrder.amountSell = web3.toWei("10", "ether");
        takerOrder.amountBuy = web3.toWei("0.2", "ether");

        await signOrder(exchangeInstance, makerOrder)
        await signOrder(exchangeInstance, takerOrder)
        let params = Order.genParams(makerOrder, takerOrder, web3.toWei("10", "ether"), feeAccount)


        await depositForTrade(exchangeInstance, tokenInstance, maker, taker, channel1Id, channel1Id);

        exchangeInstance.trade(params[0], params[1], params[2], params[3], params[4], {from: admin}).catch((e) => assert.equal(e != null, true, "this rate should not be traded!"))

    })

}

async function bacthTrade(exchangeInstance, tokenInstance, exchangeBalance, maker, taker, sells, buys, sellOrders, buyOrders, expeted, tradeAmounts) {
    // sleep.msleep(2000)
    Log.trace('sellOrders',sellOrders)
    Log.trace('buyOrders',buyOrders)
    let bo, so
    var makerOrders = [], takerOrders = []
    let nowTime = Date.now()
    for (let i = 0; i < sellOrders.length; i++) {
        bo = {
            tokenBuy: sellOrders[i].tokenBuy,
            tokenSell: sellOrders[i].tokenSell,
            user: maker,
            amountBuy: web3.toWei(sellOrders[i].amountBuy),
            amountSell: web3.toWei(sellOrders[i].amountSell),
            baseToken: '0x0',
            expires: 5000000,
            fee: 0,
            nonce: nowTime+i,
            feeToken: 0,
            channelFeeAccount : channel1FeeAccount,
            channelFee: 0,
            channelId: channel1Id,
            v: 0,
            r: 0,
            s: 0
        }
        await signOrder(exchangeInstance, bo)
        makerOrders.push(bo)
    }
    // Log.debug(makerOrders)
    for (let i = 0; i < buyOrders.length; i++) {
            so = {
            tokenBuy: buyOrders[i].tokenBuy,
            tokenSell: buyOrders[i].tokenSell,
            user: taker,
            amountBuy: web3.toWei(buyOrders[i].amountBuy),
            amountSell: web3.toWei(buyOrders[i].amountSell),
            baseToken: '0x0',
            expires: 5000000,
            fee: 0,
            nonce: nowTime+i,
            feeToken: 0,
            channelFeeAccount : channel1FeeAccount,
            channelFee: 0,
            channelId: channel1Id,
            v: 0,
            r: 0,
            s: 0
        }
        await signOrder(exchangeInstance, so)
        takerOrders.push(so)
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

    // Log.debug('tradePair:',tradePair)
    Log.debug('tradePair.length:', tradePair.length)

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
            makerOrder.baseToken,
            takerOrder.baseToken,
            makerOrder.feeToken,
            takerOrder.feeToken,
            feeAccount,
            makerOrder.channelFeeAccount,
            takerOrder.channelFeeAccount
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
            tradeAmounts[i],
            makerOrder.channelFee,
            takerOrder.channelFee,
            makerOrder.channelId,
            takerOrder.channelId
        ];
        let v = [makerOrder.v, takerOrder.v]
        let r = [makerOrder.r, takerOrder.r]
        let s = [makerOrder.s, takerOrder.s]
        Log.debug("==========")
        Log.debug(addresses,values,v,r,s)
        adds.push(addresses)
        vals.push(values)
        vs.push(v)
        rs.push(r)
        ss.push(s)

    }

    let pair = {
        baseToken: 0,
        token: tokenInstance.address
    }
    await depositForTrade(exchangeInstance, tokenInstance, maker, taker, channel1Id, channel1Id);
    // get balance before trade
    Log.debug('beforeBalance:')
    let beforeBalance = await getBalanceForTrade(exchangeInstance, bo, so, pair, feeAccount)

    try {
        let result = await exchangeInstance.batchTrade(adds, vals, vs, rs, ss, {from: admin})
        assert.equal(result.receipt.status, 1, "batchTrade failed!")
    }catch (e) {
        Log.debug('batchTrade error:',e)
        assert.equal(0,1, 'batchTrade error')
    }


    // get balance after trade
    Log.debug('afterBalance:')
    let afterBalance = await getBalanceForTrade(exchangeInstance, bo, so, pair, feeAccount)

    console.log('expeted:',  expeted);
    Log.debug(afterBalance.makerBaseBalance, beforeBalance.makerBaseBalance + expeted[0][1]);

    assert.equal(afterBalance.makerBaseBalance, beforeBalance.makerBaseBalance + expeted[0][1], "maker's base token balance should be [" + afterBalance.makerBaseBalance + "]!")
    assert.equal(afterBalance.takerBaseBalance, beforeBalance.takerBaseBalance + expeted[1][1], "taker's base token balance should be [" + afterBalance.takerBaseBalance + "]!")

    assert.equal(afterBalance.makerTokenBalance, beforeBalance.makerTokenBalance + expeted[0][0], "maker's token balance should be [" + afterBalance.makerTokenBalance + "]!")
    assert.equal(afterBalance.takerTokenBalance, beforeBalance.takerTokenBalance + expeted[1][0], "taker's token balance should be [" + afterBalance.takerTokenBalance + "]!")

}


async function signOrder(exchangeInstance, mo) {
    let hash = await exchangeInstance.getOrderHash(mo.tokenBuy, mo.amountBuy, mo.tokenSell, mo.amountSell, mo.baseToken, mo.expires, mo.nonce, mo.feeToken, mo.channelFeeAccount, mo.channelId)
    Log.debug('getOrderHash:', hash)
    var signed = web3.eth.sign(mo.user, hash);
    orderSigned = signed.substring(2, signed.length);
    mo.r = "0x" + orderSigned.slice(0, 64);
    mo.s = "0x" + orderSigned.slice(64, 128);
    mo.v = web3.toDecimal(orderSigned.slice(128, 130)) + 27;
    mo.hash = hash;
}


async function getBalanceForTrade(exchangeInstance, makerOrder, takerOrder, pair, feeAccount) {
    let result = {
        makerBaseBalance: 0,
        takerBaseBalance: 0,
        makerTokenBalance: 0,
        takerTokenBalance: 0,
        makerFeeAccBalance: 0,
        takerFeeAccBalance: 0,
        makerChannelBalance: 0,
        takerChannelBalance: 0
    }

    let baseToken = pair.baseToken
    let token = pair.token

    Log.debug('token:', token)
    Log.debug('baseToken:', baseToken)

    result.makerBaseBalance = await exchangeInstance.balanceOf(baseToken, makerOrder.user, makerOrder.channelId)
    result.makerBaseBalance = web3.fromWei(result.makerBaseBalance.valueOf())

    result.takerBaseBalance = await exchangeInstance.balanceOf(baseToken, takerOrder.user, takerOrder.channelId)
    result.takerBaseBalance = web3.fromWei(result.takerBaseBalance.valueOf())

    result.makerTokenBalance = await exchangeInstance.balanceOf(token, makerOrder.user, makerOrder.channelId)
    result.makerTokenBalance = web3.fromWei(result.makerTokenBalance.valueOf())

    result.takerTokenBalance = await exchangeInstance.balanceOf(token, takerOrder.user, takerOrder.channelId)
    result.takerTokenBalance = web3.fromWei(result.takerTokenBalance.valueOf())

    if(makerOrder.feeToken != 0) {
        result.makerFeeAccBalance = await exchangeInstance.balanceOf(makerOrder.feeToken, feeAccount, DEFAULT_CHANNEL_ID)
        result.makerChannelBalance = await exchangeInstance.balanceOf(makerOrder.feeToken, makerOrder.channelFeeAccount, makerOrder.channelId)
    } else {
        result.makerFeeAccBalance = await exchangeInstance.balanceOf(makerOrder.tokenBuy, feeAccount, DEFAULT_CHANNEL_ID)
        result.makerChannelBalance = await exchangeInstance.balanceOf(makerOrder.tokenBuy, makerOrder.channelFeeAccount, makerOrder.channelId)
    }
    Log.debug('makerOrder.feeToken:',  makerOrder.feeToken)
    result.makerFeeAccBalance = web3.fromWei(result.makerFeeAccBalance.valueOf())
    result.makerChannelBalance = web3.fromWei(result.makerChannelBalance.valueOf())


    if(takerOrder.feeToken != 0) {
        result.takerFeeAccBalance = await exchangeInstance.balanceOf(takerOrder.feeToken, feeAccount, DEFAULT_CHANNEL_ID)
        result.takerChannelBalance = await exchangeInstance.balanceOf(takerOrder.feeToken, takerOrder.channelFeeAccount, takerOrder.channelId)
    } else {
        result.takerFeeAccBalance = await exchangeInstance.balanceOf(takerOrder.tokenBuy, feeAccount, DEFAULT_CHANNEL_ID)
        result.takerChannelBalance = await exchangeInstance.balanceOf(takerOrder.tokenBuy, takerOrder.channelFeeAccount, takerOrder.channelId)
    }
    Log.debug('takerOrder.feeToken:',  takerOrder.feeToken)
    result.takerFeeAccBalance = web3.fromWei(result.takerFeeAccBalance.valueOf())
    result.takerChannelBalance = web3.fromWei(result.takerChannelBalance.valueOf())

    Log.debug(result)
    return JsonUtils.forceNumber(result)
}

async function depositForTrade(exchangeInstance, tokenInstance, maker, taker, channel1Id, channel2Id) {
    let result
    let amount = 1000
    await tokenInstance.transfer(maker, web3.toWei(amount, "ether"), {from: owner})
    await tokenInstance.transfer(taker, web3.toWei(amount, "ether"), {from: owner})

    await tokenInstance.approve(exchangeInstance.address, web3.toWei(1000000000000, "ether"), {from: maker})
    await tokenInstance.approve(exchangeInstance.address, web3.toWei(1000000000000, "ether"), {from: taker})
    await tokenInstance.approve(0, web3.toWei(1000000000000, "ether"), {from: maker})
    await tokenInstance.approve(0, web3.toWei(1000000000000, "ether"), {from: taker})

    result = await exchangeInstance.depositToken(tokenInstance.address, web3.toWei(amount, "ether"), channel1Id, {from: maker})
    result = await exchangeInstance.depositToken(tokenInstance.address, web3.toWei(amount, "ether"), channel2Id, {from: taker})

    result = await exchangeInstance.deposit(channel1Id, {value: web3.toWei(20, "ether"),from: maker})
    result = await exchangeInstance.deposit(channel2Id, {value: web3.toWei(20, "ether"),from: taker})

}