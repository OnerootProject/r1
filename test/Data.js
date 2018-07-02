var fs=require("fs")
var readline = require('readline')
var Order=require('./Order')
class Data{
    static readData(src,ethAddr,tokenAddr,verbose) {
        let lineReader=readline.createInterface({input:fs.createReadStream(src)})
        return new Promise((resolve,reject)=>{
            var sells=[],buys=[],sellOrders=[],buyOrders=[],expeted=[]
            lineReader.on("line",line=>{

                if(line !=''){
                    // console.log(line)
                    let ls=line.split(' ')
                    var order

                    if(ls[0]=='S'){
                        let tokenSell=web3.toDecimal(ls[2])
                        let ethBuy=web3.toDecimal(ls[1])*tokenSell
                        order=new Order(ethAddr,ethBuy,tokenAddr,tokenSell,500000,1)
                        sells.push([ls[1],ls[2]])
                        sellOrders.push(order)
                    }else if(ls[0]=='B'){
                        let tokenBuy=web3.toDecimal(ls[2])
                        let ethSell=web3.toDecimal(ls[1])*tokenBuy
                        order=new Order(tokenAddr,tokenBuy,ethAddr,ethSell,500000,1)
                        buys.push([ls[1],ls[2]])
                        buyOrders.push(order)
                    }else if(ls[0]=='RS'){
                        expeted.push([web3.toDecimal(ls[1]),web3.toDecimal(ls[2])])
                    }else if(ls[0]=='RB'){
                        expeted.push([web3.toDecimal(ls[1]),web3.toDecimal(ls[2])])
                    }
                }
            }).on('close',()=>{
                // console.log(sellOrders,buyOrders)
                if(verbose){
                    console.log("=================Order Data=======================")
                    for(let i=0;i<sells.length;i++){
                        console.log(sells[i][0],sells[i][1])
                    }
                    console.log('------------------')
                    for(let i=0;i<buys.length;i++){
                        console.log(buys[i][0],buys[i][1])
                    }
                    console.log("==============================================")
                    console.log("Expeted Result: seller change =",expeted[0],",buyer change =",expeted[1])
                    console.log("==============================================")
                }

                // myFunc(sells,buys,sellOrders,buyOrders,expeted)
                var res={
                    sells:sells,
                    buys:buys,
                    sellOrders:sellOrders,
                    buyOrders:buyOrders,
                    expeted:expeted
                }
                resolve(res)
            })
        })

    }
}
module.exports = Data