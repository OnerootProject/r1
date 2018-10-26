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
            from:"0xC4A9A64a9b63Bac398552065759b34c9BE244BC6"
        }
    }
}