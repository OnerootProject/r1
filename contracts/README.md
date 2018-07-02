## Order Matching Condition
* Alice sell $ x_1 $ ether and buy $ y1 $ RNT

* Bob sell $ x_2 $ RNT and buy $ y_2 $ ether

  **if we want the two orders match and trade, let:**  

$$  \frac{x_1 \cdot x_2}{y_1 \cdot y_2} \geq 1   $$

## Final Trade Price
> **As the order match,the trade price may not the same on both sides .**
> **Which price should we take ? Here we have a simple principle:think taker's profit first, trade in maker's limit price.**  
> **If taker sell at lower price, the final trade price should be maker's higher limit price;**  
> **If taker buy at higher price, the final trade price should be maker's lower limit price;**   


----------


## Contract API
### trade 
Main trade method for two orders: maker's order and taker's order  

**Before modify the balance of taker and maker, we should check the flowing conditions:**
1. maker.user != taker.user;
2. maker.tokenBuy=taker.tokenSell, maker.tokenSell=taker.tokenBuy ;
3. maker.amountSell *taker.amountSell >=maker.amountBuy *taker.amountBuy  ;(price match)
4.  check taker and maker's signature ;
5.  check baseToken correct ;
6.  check maker and taker's balances ;
7.  check maker and taker's filled order ;


#### params

| Name      |     Type |   Desc   |
| :-------- | --------:| :------: |
| **addresses**    |   Array[8] |  all address params |
| &emsp; maker.tokenBuy| String | maker's token buy address |
| &emsp; taker.tokenBuy| String | taker's token buy address |
| &emsp; maker.tokenSell| String | maker's token sell address |
| &emsp; taker.tokenSell| String | taker's token sell address |
| &emsp; maker.user| String | maker's account address |
| &emsp; taker.user| String | taker's account address |
| &emsp; maker.baseToken| String | maker's baseToken address. default is '0x0' = ETH |
| &emsp; taker.baseToken| String | taker's baseToken address. default is '0x0' = ETH |
| **values**   |   Array[10] |  all value params |
| &emsp; maker.amountBuy| Int | maker's token buy amount, in wei |
| &emsp; taker.amountBuy| Int | taker's token buy amount, in wei |
| &emsp; maker.amountSell| Int | maker's token sell amount, in wei |
| &emsp; taker.amountSell| Int | taker's token sell amount, in wei |
| &emsp; maker.fee| Int | maker's fee, in wei |
| &emsp; taker.fee| Int | taker's fee, in wei |
| &emsp; maker.expires| Int | maker's expire block |
| &emsp; taker.expires| Int | taker's expire block |
| &emsp; maker.nonce| Int | maker's nonce |
| &emsp; taker.nonce| Int | taker's nonce |
| **v**    |   Array[2] |  maker and taker's signature |
| **r**    |   Array[2] |  maker and taker's signature |
| **s**    |   Array[2] |  maker and taker's signature |

### getOrderHash
This method helps to get the order's hash easily .

#### params
| Name      |     Type |   Desc   |
| :-------- | --------:| :------: |
| **tokenBuy**    |   String |  token buy address |
| **amountBuy**    |   Int |  token buy amount, in wei |
| **tokenSell**    |   String |  token sell address |
| **amountSell**    |   Int |  token sell amount, in wei |
| **baseToken**    |   String |  base token address.if baseToken is ETH, this value ='0x0'  |
| **expires**    |   Int |  expire block |
| **nonce**    |   Int |  nonce |


----------


## How To Sign An Order
### 1. get the order's  hash
There are 2 ways to get order's hash:
-  call contract method getOrderHash ;(see contract api section)
-  use web3's SDK;
 
 **You will get the hash of the order. **

### 2. sign the order's hash


----------

## Withdraw Assets
There are two ways to withdraw assets:from exchange and from contract.  
Withdraw from contract needs the knowledge of calling contract method which is the job of developers .  
> In extreme situation ,when the relay exchange is down and not able to withdraw , you are suggested to withdraw from contract.

### Withdraw Through Exchange
Users can withdraw assets from exchange easily without the knowledge of contract,they just click the withdraw button  
on the web and sign the withdraw message s,the exchange will help to withdraw from the contract .

### Withdraw Through Contract
Withdraw through contract requires the knowledge of smart contract. Please follow the steps below :
1. Apply for withdraw: call the contract method ** applyWithdraw(tokenAddress,amount) ** ;
2. The exchange will approve user's withdraw application throw calling contract method: ** applyWithdraw(tokenAddress,amount) ** .  
if the exchange does not do this,user's application will automatically be approved in 1 day;
3. If user's application is approved or 1 days passed ,user can withdraw assets by calling contract method ** withdraw(tokenAddress,amount) ** 

> Note: It is not likely that the exchange won't approve user's application unless the exchange is hacked.  
> If this happens, user can withdraw assets after the  1 days lock time.

## How To Test This Project ?

1. run docker container 
```bash
# docker-compose up 
```

2. run shell script
```bash
# ./run_test.sh
```
> Note:install docker before run docker-compose command