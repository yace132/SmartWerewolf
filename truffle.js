module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*", // Match any network id
      gas: 100000000
    },
    parity: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 100000000
    },
    testRPC: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 100000000
    },
  }
};
