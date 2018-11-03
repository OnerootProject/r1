

class Order{
    constructor(_tokenBuy,_amountBuy,_tokenSell,_amountSell,_expires,_nonce){
        this.tokenBuy=_tokenBuy;
        this.amountBuy=_amountBuy;
        this.tokenSell=_tokenSell;
        this.amountSell=_amountSell;
        this.expires=_expires;
        this.nonce=_nonce;
    }

    static genParams(makerOrder, takerOrder, tradeAmount, feeAccount) {
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
            feeAccount,
            makerOrder.channelFeeAccount,
            takerOrder.channelFeeAccount
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
            tradeAmount,
            makerOrder.channelFee,
            takerOrder.channelFee,
            makerOrder.channelId,
            takerOrder.channelId
        ];
        var v = [makerOrder.v, takerOrder.v]
        var r = [makerOrder.r, takerOrder.r]
        var s = [makerOrder.s, takerOrder.s]

        // Log.debug('addresses:',addresses)
        // Log.debug('values:',values)
        // Log.debug('v:',v)
        // Log.debug('r:',r)
        // Log.debug('s:',s)
        return [addresses, values, v, r, s]
    }

}
module.exports = Order;