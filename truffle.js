const HDWalletProvider = require("truffle-hdwallet-provider-privkey");
const infura_apikey = "4e987044d78c44319523b16c7bf0412c";
var ownerkey = '0xa6301834a2351a1b5740ea46a8ecd881904235950a7daba6ae41c5806cc4a766';
if(ownerkey.substring(0,2)=='0x') {
    ownerkey = ownerkey.substring(2);
}
var privkey = [ownerkey];
module.exports = {
    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            network_id: '*',
            gas: 6600000
        },
        main: {
            provider: function() {
                return new HDWalletProvider(privkey, "https://mainnet.infura.io/v3/"+infura_apikey)
            },
            gas: 6600000,
            network_id: 1
        },
        ropsten: {
            provider: function() {
                return new HDWalletProvider(privkey, "https://ropsten.infura.io/v3/"+infura_apikey)
            },
            gas: 6600000,
            network_id: 3
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(privkey, "https://rinkeby.infura.io/v3/"+infura_apikey)
            },
            gas: 6000000,
            network_id: 4
        },
        kovan: {
            provider: function() {
                return new HDWalletProvider(privkey, "https://kovan.infura.io/v3/"+infura_apikey)
            },
            gas: 6000000,
            network_id: 42
        }

    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        },
    },
}