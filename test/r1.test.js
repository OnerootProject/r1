var RNTToken = artifacts.require("HumanStandardToken"); //token contract
var Exchange = artifacts.require("R1Exchange"); // real exchange contract
var web3 = Exchange.web3
var sleep = require('sleep');
var Log = require('../util/LogConsole')
var abi = require('ethereumjs-abi')
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

    let initEth = 1;
    let initRNT = 1000;
    let takerRNTBalance = initRNT + 1000;

    before(async () => {
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

    after(async () => {

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
        // for eth
        let beforeBalance = await exchangeInstance.balanceOf(0, maker, channel1Id)
        Log.debug('before eth balance:', web3.fromWei(beforeBalance.valueOf()))
        result = await exchangeInstance.depositTo(maker, channel1Id, {value: web3.toWei(amount, "ether"),from: taker})
        assert.equal(result.receipt.status, 1, "taker deposit eth to maker failed")
        let afterBalance = await exchangeInstance.balanceOf(0, maker, channel1Id)
        Log.debug('after eth balance:', web3.fromWei(afterBalance.valueOf()))
        assert.equal(web3.fromWei(afterBalance.valueOf()), web3.fromWei(beforeBalance.valueOf())*1 + amount*1, "taker deposit eth to maker failed")

        //for token
        await tokenInstance.transfer(taker, web3.toWei(takerRNTBalance, "ether"), {from: owner})
        await tokenInstance.approve(exchangeInstance.address, web3.toWei(1000000000000, "ether"), {from: taker})
        beforeBalance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('before balance:', web3.fromWei(beforeBalance.valueOf()), tokenInstance.address)
        result = await exchangeInstance.batchDepositTokenTo([tokenInstance.address], [maker], [web3.toWei(amount, "ether")], channel1Id, {from: taker})
        assert.equal(result.receipt.status, 1, "taker deposit rnt to maker failed")
        afterBalance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('after balance:', web3.fromWei(afterBalance.valueOf()), tokenInstance.address)
        assert.equal(web3.fromWei(afterBalance.valueOf()), web3.fromWei(beforeBalance.valueOf())*1 + amount*1, "taker deposit rnt to maker failed")
    })

    it("innerTransfer", async () => {
        let result
        result = await exchangeInstance.transferEnabled()
        Log.debug('before transferEnabled:',result)
        assert.equal(result, false, "transferEnabled default value should be false")
        await exchangeInstance.enableTransfer(true, {from: owner})
        result = await exchangeInstance.transferEnabled()
        Log.debug('after transferEnabled:',result)
        assert.equal(result, true, "transferEnabled value should be true")

        let amount = 1
        let makerBeforeBalance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('maker before balance:', web3.fromWei(makerBeforeBalance.valueOf()), tokenInstance.address)
        let takerBeforeBalance = await exchangeInstance.balanceOf(tokenInstance.address, taker, channel1Id)
        Log.debug('taker before balance:', web3.fromWei(takerBeforeBalance.valueOf()), tokenInstance.address)

        try {
            let result = await exchangeInstance.batchInnerTransfer([tokenInstance.address], [taker], [web3.toWei(amount, "ether")], channel1Id, {from: maker})
            Log.debug('logs:',result.receipt.logs)
            Log.debug('status:', result.receipt.status)
            assert.equal(result.receipt.status, 1, "maker innerTransfer rnt to taker failed")
        } catch (e) {
            Log.error('innerTransfer', e)
            assert.equal(e!=null, false, "innerTransfer failed")
        }

        let makerAfterBalance = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('maker after balance:', web3.fromWei(makerAfterBalance.valueOf()), tokenInstance.address)
        let takerAfterBalance = await exchangeInstance.balanceOf(tokenInstance.address, taker, channel1Id)
        Log.debug('taker after balance:', web3.fromWei(takerAfterBalance.valueOf()), tokenInstance.address)

        assert.equal(web3.fromWei(makerAfterBalance.valueOf())*1, web3.fromWei(makerBeforeBalance.valueOf())*1 - amount, "maker balance error, maker transferTo rnt to taker failed")
        assert.equal(web3.fromWei(takerAfterBalance.valueOf())*1, web3.fromWei(takerBeforeBalance.valueOf())*1 + amount, "taker balance error, maker transferTo rnt to taker failed")

        await exchangeInstance.enableTransfer(false, {from: owner})
        result = await exchangeInstance.transferEnabled()
    })


    it("changeChannel", async () => {
        let result
        result = await exchangeInstance.changeChannelEnabled()
        Log.debug('before changeChannelEnabled:',result)
        assert.equal(result, false, "changeChannelEnabled default value should be false")
        await exchangeInstance.enableChangeChannel(true, {from: owner})
        result = await exchangeInstance.changeChannelEnabled()
        Log.debug('after changeChannelEnabled:',result)
        assert.equal(result, true, "changeChannelEnabled value should be true")

        let amount = 1
        let makerBeforeBalance1 = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('maker before balance1:', web3.fromWei(makerBeforeBalance1.valueOf()), tokenInstance.address)
        let makerBeforeBalance2 = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel2Id)
        Log.debug('maker before balance2:', web3.fromWei(makerBeforeBalance2.valueOf()), tokenInstance.address)

        try {
            result = await exchangeInstance.batchChangeChannel([tokenInstance.address], [web3.toWei(amount, "ether")], channel1Id, channel2Id, {from: maker})
            Log.debug('logs:',result.receipt.logs)
            Log.debug('status:', result.receipt.status)
            assert.equal(result.receipt.status, 1, "maker changeChannel failed")
        } catch (e) {
            Log.error('changeChannel', e)
            assert.equal(e!=null, false, "changeChannel failed")
        }

        let makerAfterBalance1 = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel1Id)
        Log.debug('maker after balance1:', web3.fromWei(makerAfterBalance1.valueOf()), tokenInstance.address)
        let makerAfterBalance2 = await exchangeInstance.balanceOf(tokenInstance.address, maker, channel2Id)
        Log.debug('maker after balance2:', web3.fromWei(makerAfterBalance2.valueOf()), tokenInstance.address)

        assert.equal(web3.fromWei(makerAfterBalance1.valueOf())*1, web3.fromWei(makerBeforeBalance1.valueOf())*1 - amount, "maker balance1 error, maker changeChannel from channel1 to channel2 failed")
        assert.equal(web3.fromWei(makerAfterBalance2.valueOf())*1, web3.fromWei(makerBeforeBalance2.valueOf())*1 + amount, "maker balance2 error, maker changeChannel from channel1 to channel2 failed")

        await exchangeInstance.enableChangeChannel(false, {from: owner})
    })

    it("adminWithdraw", async () => {
        Log.debug('adminWithdraw hash:', [exchangeInstance.address, taker, tokenInstance.address, web3.toWei("1", "ether"), 11, feeAccount, channel2FeeAccount, channel2Id])
        let hash = "0x" + abi.soliditySHA3(["address", "address", "address", "uint256", "uint256", "address", "address", "uint256"],
            [exchangeInstance.address, taker, tokenInstance.address, web3.toWei("1", "ether"), 11, feeAccount, channel2FeeAccount, channel2Id]
        ).toString("hex")
        Log.debug("=========", hash)
        var signed = web3.eth.sign(taker, hash);
        let orderSigned = signed.substring(2, signed.length);
        let r = "0x" + orderSigned.slice(0, 64);
        let s = "0x" + orderSigned.slice(64, 128);
        let v = web3.toDecimal(orderSigned.slice(128, 130)) + 27;
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

    // trade cases are in r1Trade.test.js

});
