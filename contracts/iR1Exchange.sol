pragma solidity ^0.4.20;

contract iR1Exchange {
    event Deposit(address indexed token, address indexed user, uint256 amount, uint256 balance, uint256 channelId);
    event DepositTo(address indexed token, address indexed from, address indexed user, uint256 amount, uint256 balance, uint256 channelId);
    event Withdraw(address indexed token, address indexed user, uint256 amount, uint256 balance, uint256 channelId);
    event ApplyWithdraw(address indexed token, address indexed user, uint256 amount, uint256 time, uint256 channelId);
    event ApproveWithdraw(address indexed token, address indexed user, uint256 channelId);
    event Trade(address indexed maker, address indexed taker, uint256 amount, uint256 makerFee, uint256 takerFee, uint256 makerNonce, uint256 takerNonce);
    event InnerTransfer(address indexed token, address indexed from, address indexed to, uint256 amount, uint256 balance, uint256 channelId);
    event ChangeChannel(address indexed token, address indexed user, uint256 amount, uint256 fromChannelId, uint256 toChannelId);
    event BatchCancel(uint256 count, uint256 channelId);

    function setAdmin(address admin, bool isAdmin) public;

    function setFeeAccount(address acc, bool asFee) public;

    function enableWithdraw(bool enabled) public;

    function enableDepositTo(bool enabled) public;

    function enableTransfer(bool enabled) public;

    function enableChangeChannel(bool enabled) public;

    function changeLockTime(uint lock) public;

    function changeFeeRate(uint fr);

    function stopTrade();

    /**
    * cancel the order that before nonce.
    **/
    function batchCancel(address[] users, uint256[] nonces, uint256 channelId) public;

    function deposit(uint256 channelId) public payable;

    function depositToken(address token, uint256 amount, uint256 channelId) public;

    function depositTo(address token, address to, uint256 amount, uint256 channelId) public;

    function batchDepositTo(address[] token, address[] to, uint256[] amount, uint256 channelId) public;

    function innerTransfer(address token, address to, uint256 amount, uint256 channelId) public;

    function batchInnerTransfer(address[] token, address[] to, uint256[] amount, uint256 channelId) public;

    function changeChannel(address token, uint256 amount, uint256 fromChannelId, uint256 toChannelId) public;

    function batchChangeChannel(address[] token,  uint256[] amount, uint256 fromChannelId, uint256 toChannelId) public;

    function applyWithdraw(address token, uint256 amount, uint256 channelId) public;

    /**
    * approve user's withdraw application
    **/
    function approveWithdraw(address token, address user, uint256 channelId) public;

    /**
    * user's withdraw will success in two cases:
    *    1. when the admin calls the approveWithdraw function;
    * or 2. when the lock time has passed since the application;
    **/
    function withdraw(address token, uint256 amount, uint256 channelId) public;

    /**
    * withdraw directly when withdrawEnabled=true
    **/
    function withdrawNoLimit(address token, uint256 amount, uint256 channelId) public ;

    /**
    * admin withdraw according to user's signed withdraw info
    * PARAMS:
    * addresses:
    * [0] user
    * [1] token
    * [2] feeAccount
    * [3] channelFeeAccount
    * values:
    * [0] amount
    * [1] nonce
    * [2] fee
    * [3] channelFee
    * [4] channelId
    **/
    function adminWithdraw(address[4] addresses, uint256[5] values,  uint8 v, bytes32 r, bytes32 s) public;

    function getOrderHash(address tokenBuy, uint256 amountBuy, address tokenSell, uint256 amountSell, address base, uint256 expires, uint256 nonce, address feeToken, address channelFeeAccount, uint256 channelId) public view returns (bytes32) ;

    function balanceOf(address token, address user, uint256 channelId) public constant returns (uint256);


    /**
    * swap maker and taker's tokens according to their signed order info.
    *
    * PARAMS:
    * addresses:
    * [0]:maker tokenBuy
    * [1]:taker tokenBuy
    * [2]:maker tokenSell
    * [3]:taker tokenSell
    * [4]:maker user
    * [5]:taker user
    * [6]:maker baseTokenAddr .default:0 ,then baseToken is ETH
    * [7]:taker baseTokenAddr .default:0 ,then baseToken is ETH
    * [8]:maker feeToken .
    * [9]:taker feeToken .
    * [10]:feeAccount
    * [11]:makerChannelAccount
    * [12]:takerChannelAccount
    * values:
    * [0]:maker amountBuy
    * [1]:taker amountBuy
    * [2]:maker amountSell
    * [3]:taker amountSell
    * [4]:maker fee
    * [5]:taker fee
    * [6]:maker expires
    * [7]:taker expires
    * [8]:maker nonce
    * [9]:taker nonce
    * [10]:tradeAmount of token
    * [11]:makerChannelFee
    * [12]:takerChannelFee
    * [13]:makerChannelId
    * [14]:takerChannelId
    * v,r,s:maker and taker's signature
    **/
    function trade(
        address[13] addresses,
        uint256[15] values,
        uint8[2] v,
        bytes32[2] r,
        bytes32[2] s
    ) public;

    function batchTrade(
        address[13][] addresses,
        uint256[15][] values,
        uint8[2][] v,
        bytes32[2][] r,
        bytes32[2][] s
    ) public;

    ///help to refund token to users.this method is called when contract needs updating
    function refund(address user, address[] tokens, uint256[] channelIds) public;
}
