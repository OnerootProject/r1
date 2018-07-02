
# R1协议接口说明
## 简介
合约文件为R1Exchange.sol.  
本合约要求将部分合约调用交由后台完成，以期达到后台可控的订单撮合，提供更好的交易体验。

##### 由后台发起的合约调用包含：
1. trade/batchTrade:交易上链；
2. adminWithdraw:admin提现；
3. approveWithdraw:通过提现申请；

#### 由前端（用户）发起的合约调用包含：
1. deposit/depositToken:充值ETH或者token；
2. balanceOf:余额查询；
3. applyWithdraw:用户通过调用合约方法发起提现申请；
4. withdraw/withdrawNoLimit:用户通过合约提现



## 交易上链
整个交易流程如下：
1. 用户在前端提交订单；
2. 前端利用用户的私钥对订单信息进行签名，需要签名的参数见 **订单签名** 小节；
3. 后端收到前端的订单信息和签名，对签名进行正确性校验；
4. 后端撮合成功后，将匹配订单提交上链；

### 订单签名
前端签名订单的步骤如下：
1. 对订单参数求hash。
  需要签名的订单参数
  
| 参数名称 |   说明   |
| :--------| :------: |
| **tokenBuy** |  买入token的合约地址 |
| **amountBuy** |  买入token的数量 |
| **tokenSell** |  卖出token的合约地址  |
| **amountSell** |  卖出token的数量  |
| **baseToken** |  基准token |
| **expires** |  过期区块号 |
| **nonce** |  随机数 |
| **feeToken** |  手续费支付方式。0：传统支付模式（扣减用户获得的token）；如果使用erc-20支付，填对应的token地址 |

按以上参数顺序进行sha3计算，得到hash值。

2. 对步骤1中得到的hash值进行签名  

得到的签名是16进制字符串，需要转换为v、r、s三个参数

### 验证签名
后台需要对v、 r、 s签名信息进行验证，调用web3提供的ecrecover方法即可

## 提现委托
用户通过我们的前端页面提现，不需要前端直接提交到链上提现。具体步骤如下：
1. 用户发起提现请求；
2. 前端对用户的提现信息进行签名后，发到后台；
3. 后台更新用户余额，再提交到链上合约提现；

## 提现信息签名
同订单信息签名一样，需要对提现信息求hash，其他步骤都一样。
  需要签名的提现信息参数
  
| 参数名称 |   说明   |
| :--------| :------: |
| **user** |  提现用户的账号 |
| **token** |  提现token的地址 |
| **amount** |  提现数量  |
| **nonce** |  随机数 |

按以上参数顺序进行sha3计算，得到hash值。

## 合约API
### trade
maker和taker订单撮合交易的接口。
```javascript
function trade(
        address[11] addresses,
        uint256[11] values,
        uint8[2] v,
        bytes32[2] r,
        bytes32[2] s
    )
```

#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| **addresses**    |   Array[8] |  地址类参数 |
| &emsp; maker.tokenBuy| String | maker买入token的地址 |
| &emsp; taker.tokenBuy| String | taker买入token的地址 |
| &emsp; maker.tokenSell| String | maker卖出token的地址 |
| &emsp; taker.tokenSell| String | taker卖出token的地址 |
| &emsp; maker.user| String | maker账号 |
| &emsp; taker.user| String | taker账号 |
| &emsp; maker.baseToken| String | maker的交易对基准token。默认为“0x0”，ETH |
| &emsp; taker.baseToken| String | taker的交易对基准token。默认为“0x0”，ETH |
| &emsp; maker.feeToken| String | 手续费支付方式。如果为0，按传统方式支付；如果为erc-20 token支付，填对应地址 |
| &emsp; taker.feeToken| String | 手续费支付方式。如果为0，按传统方式支付；如果为erc-20 token支付，填对应地址 |
| &emsp; feeAccount| String | 手续费接受地址。该地址需要经过合约授权才有效|
| **values**   |   Array[10] |  数值类参数 |
| &emsp; maker.amountBuy| Int | maker买入的token数量，单位wei |
| &emsp; taker.amountBuy| Int | taker买入的token数量，单位wei |
| &emsp; maker.amountSell| Int | maker卖出的token数量，单位wei |
| &emsp; taker.amountSell| Int | taker卖出的token数量，单位wei |
| &emsp; maker.fee| Int | maker手续费 |
| &emsp; taker.fee| Int | taker手续费 |
| &emsp; maker.expires| Int | maker订单区块过期数 |
| &emsp; taker.expires| Int | taker订单区块过期数 |
| &emsp; maker.nonce| Int | maker随机数 |
| &emsp; taker.nonce| Int | taker随机数 |
| &emsp; tradeAmount| Int | token的交易数量 |
| **v**    |   Array[2] |  maker和taker的签名v |
| **r**    |   Array[2] |  maker和taker的签名r |
| **s**    |   Array[2] |  maker和taker的签名s |

### batchTrade

批量交易，与trade方法类似。参数类型与trade相同，只不过batchTrade传的是数组形式的参数

```javascript
function batchTrade(
        address[11][] addresses,
        uint256[11][] values,
        uint8[2][] v,
        bytes32[2][] r,
        bytes32[2][] s
    ) 
```

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| **addresses**    |   Array[11][] |  地址类参数 |
| **values**   |   Array[10][] |  数值类参数 |
| **v**    |   Array[2][] |  maker和taker的签名v |
| **r**    |   Array[2][] |  maker和taker的签名r |
| **s**    |   Array[2][] |  maker和taker的签名s |


### adminWithdraw

委托admin提现。前端先对用户的提现请求进行签名得到r s v签名数据，后台验证后提交到链上。
只有admin可操作此方法。

```javascript
function adminWithdraw(address[3] addresses, uint256[3] values, uint8 v, bytes32 r, bytes32 s)
```

#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| **addresses**    |   Array[3] |  地址类参数 |
| &emsp; user| String | 用户账号 |
| &emsp; token| String | 提现token地址 |
| &emsp; feeAccount| String | 手续费接收地址 |
| **values**    |   Array[3] |  数值类参数 |
| &emsp; amount| Int | 提现金额 |
| &emsp; nonce| Int | 随机数 |
| &emsp; fee| Int | 提现手续费 |
| **v**    |   int |  签名参数v |
| **r**    |   string |  签名参数r |
| **s**    |   string |  签名参数s |

### applyWithdraw
用户调用此方法申请提现
```javascript
function applyWithdraw(address token, uint256 amount)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address |  需要提现的token |
| amount    |   int |  需要提现的token数量 |

### approveWithdraw
通过用户的申请提现。只有admin可以调用此方法，由Relayer调用此方法
```javascript
function approveWithdraw(address token, address user)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address |  提现的token |
| user    |   address |  提现的用户账号 |

### withdraw
用户调用此方法提现。在调用此方法前，用户需要先调用`applyWithdraw` 方法，待Relayer同意提现（admin调用approveWithdraw）或者超过7天后，用户能够成功提现。这里称之为`两阶段(apply+confirm)提现`
```javascript
function withdraw(address token, uint256 amount)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address |  需要提现的token |
| amount    |   int |  需要提现的token数量 |

### withdrawNoLimit
此方法允许用户自由提现，不需要繁琐的`两阶段提现`。只有开关withdrawEnabled=true时（一般在Relayer无法响应调用`approveWithdraw`方法时开启），用户才可以调用此方法。
```javascript
function withdrawNoLimit(address token, uint256 amount)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address |  需要提现的token |
| amount    |   int |  需要提现的token数量 |

### balanceOf
查询用户再合约中的资产余额
```javascript
function balanceOf(address token, address user)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address |  token 的地址|
| user    |   address |  用户账号|

### deposit
用户充值ETH
```javascript
function deposit()
```
#### 参数
无

### depositToken
用户充值token
```javascript
function depositToken(address token, uint256 amount)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address | 充值的token地址|
| amount    |   int |  充值数量|

## 环境
### kovan testnet
**R1Exchange:** 0x11d637997bfFf7c2c8d6ca7892806b3C0980B0a0,0x02Fd712f100D73653dFb5120B7A9B14fAf619bDb,0x7efcA8454e579215830B9226e2c67ECF1b8CedC2

**admin 账号：** 0x899b5aab87326cafc71189f87a36584e02be2c83,0xaee83b86da465c6daa9c65164db25821f272b8ce,0x031d8da61261bc51e95affcc74359bbd6fcf388d,0xC0260c9dD73010044802299e71fab7B663055d21

**已授权fee Account：** 0x00B9022a6b81E954129d6f807d7c9F3274820176

### mainet

#### pre env
**R1Exchange:** 0x78987a34935754eD24B3868C94e1a98e9161f36B

**admin 账号：** 
* 0x847D22c8479ce704f1e8873ea407537377A5B48F
* 0xC36229f9C3124FAC85D9dEb2EaF624D6598167d6

**已授权fee Account：** 0x002479425a15ABb09023c7c3F7E0caCA94Cd3788

#### prod env

**R1Exchange:** 0x353D92db08564500d812DDFD23a668D2F405ED85

**admin 账号：** 
* 0x457804851EAf090DAD4871F9609010C6868D99d4
* 0xA0E85343129e21A625E980065dCa05856BB6BCFe
* 0xA3cAda064D65b48C6c3ed9adAbE1923966a2719B

**已授权fee Account：** 0x0036f645ABC5DD446BeF60a014E6c0CE42Fe0731

## 如何运行测试用例 ?

1. 启动docker容器 
```bash
# docker-compose up 
```

2. 运行测试脚本
```bash
# ./run_test.sh
``` 
> 注意：运行docker-compose命令前请安装docker


