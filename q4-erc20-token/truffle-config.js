// This is the default Truffle configuration file, modified for our assignment.

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions.
   */
  networks: {
    // This is the default network Truffle uses for `truffle develop`.
    development: {
      host: "127.0.0.1",     // Localhost
      port: 8545,            // Standard Ethereum client port
      network_id: "*",       // Match any network id
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      // Set the specific compiler version required by our contracts.
      version: "0.8.20",
      // The settings object is where we configure the optimizer.
      settings: {
        // Enable the optimizer to reduce gas costs.
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  },
};