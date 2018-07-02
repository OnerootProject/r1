

class Order{
    constructor(_tokenBuy,_amountBuy,_tokenSell,_amountSell,_expires,_nonce){
        this.tokenBuy=_tokenBuy;
        this.amountBuy=_amountBuy;
        this.tokenSell=_tokenSell;
        this.amountSell=_amountSell;
        this.expires=_expires;
        this.nonce=_nonce;
    }
}
module.exports = Order;