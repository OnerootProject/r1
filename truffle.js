module.exports = {
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
    networks: {
        development: {
            host: '127.0.0.1',
            port: 7545,
            // gas:6000000,
            network_id: '*' // Match any network id
        },
        kovan: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*',
            gas: 4612388,
            from:"0xe083E4605E43BF55AeC5285e23c0E464Db100bbC"
        }
    }
}