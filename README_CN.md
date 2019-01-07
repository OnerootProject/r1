
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
        address[13] addresses,
        uint256[15] values,
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
| &emsp; makerChannelAccount| String | maker通道方手续费接受地址|
| &emsp; takerChannelAccount| String | maker通道方手续费接受地址|
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
| &emsp; makerChannelFee| Int | maker通道方手续费数量 |
| &emsp; takerChannelFee| Int | taker通道方手续费数量 |
| &emsp; makerChannelId| Int | maker通道方ID |
| &emsp; takerChannelId| Int | taker通道方ID |
| **v**    |   Array[2] |  maker和taker的签名v |
| **r**    |   Array[2] |  maker和taker的签名r |
| **s**    |   Array[2] |  maker和taker的签名s |

### batchTrade

批量交易，与trade方法类似。参数类型与trade相同，只不过batchTrade传的是数组形式的参数

```javascript
function batchTrade(
        address[13][] addresses,
        uint256[15][] values,
        uint8[2][] v,
        bytes32[2][] r,
        bytes32[2][] s
    )
```

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| **addresses**    |   Array[13][] |  地址类参数 |
| **values**   |   Array[15][] |  数值类参数 |
| **v**    |   Array[2][] |  maker和taker的签名v |
| **r**    |   Array[2][] |  maker和taker的签名r |
| **s**    |   Array[2][] |  maker和taker的签名s |


### adminWithdraw

委托admin提现。前端先对用户的提现请求进行签名得到r s v签名数据，后台验证后提交到链上。
只有admin可操作此方法。

```javascript
function adminWithdraw(address[4] addresses, uint256[5] values, uint8 v, bytes32 r, bytes32 s)
```

#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| **addresses**    |   Array[4] |  地址类参数 |
| &emsp; user| String | 用户账号 |
| &emsp; token| String | 提现token地址 |
| &emsp; feeAccount| String | 手续费接收地址 |
| &emsp; channelFeeAccount| String | 通道方手续费接收地址 |
| **values**    |   Array[5] |  数值类参数 |
| &emsp; amount| Int | 提现金额 |
| &emsp; nonce| Int | 随机数 |
| &emsp; fee| Int | 提现手续费 |
| &emsp; channelFee| Int | 通道方手续费 |
| &emsp; channelId| Int | 通道方ID |
| **v**    |   int |  签名参数v |
| **r**    |   string |  签名参数r |
| **s**    |   string |  签名参数s |

### batchCancel
取消用户订单
```javascript
function batchCancel(address[] users, uint256[] nonces, uint256 channelId)
```
#### 参数

| 参数名称    |     类型  |   说明   |
| :-------- | --------:| :------: |
| users | address[] | 取消的用户地址 |
| nonces | int[] | 取消的订单nonce |
| channelId | int | 通道方ID |

### applyWithdraw
用户调用此方法申请提现
```javascript
function applyWithdraw(address token, uint256 amount, uint256 channelId)
```
#### 参数

| 参数名称    |     类型  |   说明   |
| :-------- | ---------:| :------------: |
| token     |   address |  需要提现的token |
| amount    |   int     |  需要提现的token数量 |
| channelId |   int     |  通道方ID |

### approveWithdraw
通过用户的申请提现。只有admin可以调用此方法，由Relayer调用此方法
```javascript
function approveWithdraw(address token, address user, uint256 channelId)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address |  提现的token |
| user     |   address |  提现的用户账号 |
| channelId |   int     |  通道方ID |

### withdraw
用户调用此方法提现。在调用此方法前，用户需要先调用`applyWithdraw` 方法，待Relayer同意提现（admin调用approveWithdraw）或者超过7天后，用户能够成功提现。这里称之为`两阶段(apply+confirm)提现`
```javascript
function withdraw(address token, uint256 amount, uint256 channelId)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token     |   address |  需要提现的token |
| amount    |   int |  需要提现的token数量 |
| channelId |   int     |  通道方ID |

### withdrawNoLimit
此方法允许用户自由提现，不需要繁琐的`两阶段提现`。只有开关withdrawEnabled=true时（一般在Relayer无法响应调用`approveWithdraw`方法时开启），用户才可以调用此方法。
```javascript
function withdrawNoLimit(address token, uint256 amount, uint256 channelId)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token     |   address |  需要提现的token |
| amount    |   int |  需要提现的token数量 |
| channelId |   int     |  通道方ID |

### balanceOf
查询用户再合约中的资产余额
```javascript
function balanceOf(address token, address user, uint256 channelId)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address |  token 的地址|
| user     |   address |  用户账号|
| channelId |   int     |  通道方ID |

### deposit
用户充值ETH
```javascript
function deposit(uint256 channelId)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :-------: |
| channelId |   int    |  通道方ID  |

### depositToken
用户充值token
```javascript
function depositToken(address token, uint256 amount, uint256 channelId)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address | 充值的token地址|
| amount    |   int |  充值数量|
| channelId |   int     |  通道方ID |

### depositTo
用户给其他用户充值token
```javascript
function depositTo(address token, address to, uint256 amount, uint256 channelId)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address | 充值的token地址|
| to       |   address | 接收人地址|
| amount    |   int |  充值数量|
| channelId |   int     |  通道方ID |

### batchDepositTo
用户批量给其他用户充值token，与depositTo方法类似。参数类型与depositTo相同，只不过batchDepositTo传的是数组形式的参数
```javascript
function batchDepositTo(address[] token, address[] to, uint256[] amount, uint256 channelId)
```

### innerTransfer
用户内部转账给其他用户
```javascript
function innerTransfer(address token, address to, uint256 amount, uint256 channelId)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address | 转账的token地址|
| to       |   address | 接收人地址|
| amount    |   int |  充值数量|
| channelId |   int     |  通道方ID |

### batchInnerTransfer
用户批量内部转账给其他用户，与innerTransfer方法类似。参数类型与innerTransfer相同，只不过batchInnerTransfer传的是数组形式的参数
```javascript
function batchInnerTransfer(address[] token, address[] to, uint256[] amount, uint256 channelId)
```

### changeChannel
用户把token从一个通道方转到另一个通道方
```javascript
function changeChannel(address token, uint256 amount, uint256 fromChannelId, uint256 toChannelId)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| token    |   address | 转移的token地址|
| amount    |   int |  转移的数量|
| fromChannelId |   int     |  转出通道方ID |
| toChannelId |   int     |  转入通道方ID |

### batchChangeChannel
用户批量把token从一个通道方转到另一个通道方，与changeChannel方法类似。参数类型与changeChannel相同，只不过batchInnerTransfer传的是数组形式的参数
```javascript
function batchChangeChannel(address[] token,  uint256[] amount, uint256 fromChannelId, uint256 toChannelId)
```

### refund
退还用户token
```javascript
function refund(address user, address[] tokens, uint256[] channelIds)
```
#### 参数

| 参数名称      |     类型 |   说明   |
| :-------- | --------:| :------: |
| user    |   address | 用户钱包地址|
| tokens    |   address | 用户token地址列表|
| channelIds |   int     |  通道方ID列表 |


## 环境
### kovan testnet
**R1Exchange:** 0xC8BfdDEE1CAC0AFAB2cE63e94CDe1f4f2ef6f7b2,0x99129d3e690b429e30020ba2f904202c125271ee,0xb3d9cc357fbaa00be090b8de484dba1d6f6d5192,0x6ae8203f3a4b61f6422a0f5c59cc4cd950ca3b60

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


