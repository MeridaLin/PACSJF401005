// This is a Truffle migration script.

// 1. Import the contract artifact we want to deploy.
// The `artifacts.require()` function tells Truffle which contract we are interacting with.
// It's like Node.js's `require()`, but specifically for getting compiled contract data.
const XYZCoin = artifacts.require("XYZCoin");

// 2. Export a function.
// All migration scripts must export a function that accepts a `deployer` object as its first parameter.
// The `deployer` object is the main tool for staging deployment tasks.
module.exports = function (deployer) {
  // 3. Instruct the deployer to deploy our contract.
  // The `deployer.deploy()` function is an asynchronous operation that handles
  // the deployment of the specified contract.
  deployer.deploy(XYZCoin);
};