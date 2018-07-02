# R1 Protocol Interface Description
## Introduction
The contract file is R1Exchange.sol.
This contract requires that some of the contract call be completed by the back-end in order to achieve back-end controlled order matching and provide a better trading experience.

##### The contract call initiated by the back-end contains:
1. trade/batchTrade: on-chain trading;
2. adminWithdraw: admin withdrawal;
3. approveWithdraw: pass withdrawa request;

#### Contract call initiated by the client (users) includes:
1. deposit/depositToken:: top up ETH or token;
2. balanceOf: balance inquiry;
3. applyWithdraw: Users initiate a withdrawal request by calling the contract method;
4. withdraw/withdrawNoLimit: Users withdraw assets through contract

## The submission of transactions on chain
The entire transaction process is as follows:
1. The user submits the order on client;
2. The client uses the user's private key to sign the order information. For the parameters to be signed, see **Order Signing** section;
3. The back-end receives order information and signatures from  client to verify the correctness of the signature;
4. After the back-end matching is successful, the matched order will be submitted to the chain;

### Order signing
The steps for signing an order on the front-end are as follows:
1. Request hash for order parameters.
   Order parameters that require signing

| Parameter Name | Description |
| :--------| :------: |
| **tokenBuy** | contract address that buys token |
| **amountBuy** | amount of token to buy |
| **tokenSell** | contract address that sells token |
| **amountSell** | amount of token to sell |
| **baseToken** | base token |
| **expires** | Expired block number |
| **nonce** | Random numbers |
| **feeToken** | Fee payment method. 0: traditional payment method (deduct the token obtained by the user); if using erc-20 token for payment, fill in the corresponding token address |

Sha3 is calculated according to the above parameter sequence, and the hash value is obtained.

2. Sign the hash value obtained in step 1

The resulting signature is a hexadecimal string that needs to be converted to three parameters: v, r, s

### Validate the signature
The back-end needs to verify the signature information of v, r, s , and call the `ecrecover ` method provided by web3.

## Delegate Withdrawal
If withdraw asset through client, the request will not be committed on  chain. Specific steps are as follows:
1. The user initiates a withdrawal request;
2. The front-end signs the user's withdrawal information and sends it to the back-end.
3. The back-end updates user balance  and submit it to the chain for withdrawal;

## Withdrawal information signing
As with the order information signature, you need to get hash from the withdrawal information, and the other steps are the same.
   The required withdrawal information parameter
  
| Parameter Name | Description |
| :--------| :------: |
| **user** | Withdrawal user's account |
| **token** | Withdrawal token's address |
| **amount** | Withdrawal amount |
| **nonce** | Random numbers |

Sha3 is calculated according to the above parameter sequence, and the hash value is obtained.

## Contract API
### trade
Maker and taker order matching transaction interface.
```javascript
function trade(
        address[11] addresses,
         uint256[11] values,
         uint8[2] v,
         bytes32[2] r,
         bytes32[2] s
     )
```

#### Parameters

| Parameter Name | Type | Description |
| :-------- | --------:| :------: |
| **addresses** | Array[8] | Address class parameters |
| &emsp; maker.tokenBuy| String | Address that maker buy token |
| &emsp; taker.tokenBuy| String | Address that taker buy token  |
| &emsp; maker.tokenSell| String | Address that maker sell token |
| &emsp; taker.tokenSell| String | Address that taker sell token |
| &emsp; maker.user| String | Maker account |
| &emsp; taker.user| String | Taker account |
| &emsp; maker.baseToken| String | Maker's trade pair base token. The default is "0x0", ETH |
| &emsp; taker.baseToken|String | Taker's trade pair base token. The default is "0x0", ETH |
| &emsp; maker.feeToken | String | Fee payment method. If it is 0, pay in the traditional way; if pay for erc-20 token, fill in the corresponding address |
| &emsp; feeAccount | String | Fee acceptance address. This address needs to be authorized by contract |
| **values** | Array[10] | Numeric Parameters |
| &emsp; maker.amountBuy| Int | Number of token bought by maker, unit wei |
| &emsp;taker.amountBuy| Int | Number of token bought by taker, unit wei |
| &emsp; maker.amountSell| Int | Number of token sold by maker | wei |
| &emsp; taker.amountSell| Int | Number of token sold by taker, unit wei |
| &emsp; maker.fee| Int | Maker fee |
| &emsp; taker.fee| Int | Taker fee |
| &emsp; maker.expires| Int | Maker order block expiration number |
| &emsp; taker.expires| Int | Taker order block expiration number |
| &emsp; maker.nonce| Int | Maker random number |
| &emsp; taker.nonce| Int | Taker random number |
| &emsp; tradeAmount| Int | Transaction number of token |
| **v** | Array[2] | Signature v of maker and taker |
| **r** | Array[2] | Signature r of maker and taker |
| **s** | Array[2] | Signature s of maker and taker |

### batchTrade

batch trade are similar to the trade method. The parameter type is the same as trade, except that batchTrade passes an array of parameters

```javascript
function batchTrade(
        address[11][] addresses,
        uint256[11][] values,
        uint8[2][] v,
        bytes32[2][] r,
        bytes32[2][] s
    ) 
```

| Parameter Name | Type | Description |
| :-------- | --------:| :------: |
| **addresses** | Array[11][] | Address parameters |
| **values** | Array[10][] | Numerical parameters |
| **v** | Array[2][] | Signature v of maker and taker |
| **r** | Array[2][] | Signature r of maker and taker |
| **s** | Array[2][] | Signature s of maker and taker |

### adminWithdraw

Delegate admin withdrawal. The client first signs the user's withdrawal request to get r s v signature data, which is submitted to the chain after verification in the back-end.
Only admin can operate this method.

```javascript
function adminWithdraw(address[3] addresses, uint256[3] values, uint8 v, bytes32 r, bytes32 s)
```


#### Parameters

| Parameter Name | Type | Description |
| :-------- | --------:| :------: |
| **addresses** | Array[3] | Address parameters |
| &emsp; user| String | User account |
| &emsp; token| String | Withdrawal token address |
| &emsp; feeAccount| String | Fee receiving address |
| **values** | Array[3] | Numeric parameters |
| &emsp; amount| Int | Withdrawal amount |
| &emsp; nonce| Int | Random numbers |
|emem; fee| Int | Withdrawal fee |
| **v** | int | Signature parameters v |
| **r** | string | signature parameter r |
| **s** | string | Signature parameters s |

### applyWithdraw
The user calls this method to request for withdrawal
```javascript
function applyWithdraw(address token, uint256 amount)
```
#### Parameters

| Parameter Name | Type | Description |
| :-------- | --------:| :------: |
| token | address | Token to be withdrawn |
Amount | int | Number of token to be withdrawn |

### approveWithdraw
Withdrawal from the user's request. Only admin can call this method, this method is called by Relayer
```javascript
Function approveWithdraw(address token, address user)
```

#### Parameters

| Parameter Name | Type | Description |
| :-------- | --------:| :------: |
| token | address | Token for withdrawal |
| User | address | User account for withdrawal |

### Withdraw
The user calls this method for withdrawal. Before calling this method, the user needs to call the `applyWithdraw` method first, and after Relayer agrees to withdraw (admin calls applyWithdraw) or after 7 days, the user can successfully withdraw. This is called two-phase (`apply+confirm) withdrawal`
```javascript
function withdraw(address token, uint256 amount)
```
#### Parameters

| Parameter Name | Type | Description |
| :-------- | --------:| :------: |
| token | address | Token to be withdrawn |
| Amount | int | Number of token to be withdrawn |

### withdrawNoLimit
This method allows users to freely withdraw without the need for tedious `two-phase withdrawal`. The user can call this method only if the switch withdrawEnabled=true is on (usually it is on when Relayer does not respond to the call to the `approveWithdraw` method).
```javascript
function withdrawNoLimit(address token, uint256 amount)
```
#### Parameters

| Parameter Name | Type | Description |
| :-------- | --------:| :------: |
| token | address | Token to be withdrawn |
Amount | int | Number of token to be withdrawn |

### balanceOf
Query the balance of assets in the customer's contract
```javascript
function balanceOf(address token, address user)
```
#### Parameters

| Parameter Name | Type | Description |
| :-------- | --------:| :------: |
| token | address | Token address |
| Amount | int | User account |

### deposit
Users deposit ETH
```javascript
function deposit()
```
#### Parameters
None

### depositToken
Users deposit token
```javascript
function depositToken(address token, uint256 amount)
```

#### Parameters

| Parameter Name | Type | Description |
| :-------- | --------:| :------: |
| token | address | Top-up token address |
| amount | int | Top-up quantity |

## Environment
### kovan testnet
**R1Exchange:** 0x11d637997bfFf7c2c8d6ca7892806b3C0980B0a0,0x02Fd712f100D73653dFb5120B7A9B14fAf619bDb,0x7efcA8454e579215830B9226e2c67ECF1b8CedC2

**admin account:** 
* 0x899b5aab87326cafc71189f87a36584e02be2c83
* 0xaee83b86da465c6daa9c65164db25821f272b8ce
* 0x031d8da61261bc51e95affcc74359bbd6fcf388d
* 0xC0260c9dD73010044802299e71fab7B663055d21

**Authorized fee account：** 0x00B9022a6b81E954129d6f807d7c9F3274820176

### mainet

#### pre env
**R1Exchange:** 0x78987a34935754eD24B3868C94e1a98e9161f36B

**dmin account:** 
* 0x847D22c8479ce704f1e8873ea407537377A5B48F
* 0xC36229f9C3124FAC85D9dEb2EaF624D6598167d6

**Authorized fee account：** 0x002479425a15ABb09023c7c3F7E0caCA94Cd3788

#### prod env

**R1Exchange:** 0x353D92db08564500d812DDFD23a668D2F405ED85

**admin account:** 
* 0x457804851EAf090DAD4871F9609010C6868D99d4
* 0xA0E85343129e21A625E980065dCa05856BB6BCFe
* 0xA3cAda064D65b48C6c3ed9adAbE1923966a2719B

**Authorized fee account：** 0x0036f645ABC5DD446BeF60a014E6c0CE42Fe0731

##  run test cases

1. Start the docker container
```bash
# docker-compose up 
```

2. Run the test script
```bash
# ./run_test.sh
``` 
> Note: Please install docker before running docker-compose command
