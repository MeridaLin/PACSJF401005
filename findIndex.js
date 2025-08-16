// Import the Web3 class from the web3 library using destructuring.
// This is the correct syntax for web3.js v4.x.
const { Web3 } = require('web3');

// Your personal Infura API Key.
// This is your access pass to the Ethereum network through Infura's nodes.
const INFURA_API_KEY = 'fb76e750221041bbad58543c943af5ac';

// We construct the full RPC endpoint URL for the Ethereum Mainnet.
const INFURA_URL = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;

// Create a new Web3 instance and connect it to our Infura endpoint.
const web3 = new Web3(INFURA_URL);

/**
 * An asynchronous function to find the first contract creation transaction.
 */
async function findFirstContractCreation() {
    console.log("Starting search for the first contract creation transaction...");

    try {
        // The very first contract on Ethereum was created in block #46147.
        // For efficiency, we will directly check this known block.
        // A more comprehensive (but much slower) script would start from the latest block
        // (`await web3.eth.getBlockNumber()`) and loop backwards.
        const searchBlock = 46147;

        console.log(`Checking known block: ${searchBlock}...`);

        // Request the full block data from the blockchain.
        // The `true` argument tells Web3 to return the full transaction objects, not just their hashes.
        const block = await web3.eth.getBlock(searchBlock, true);

        // Check if the block and its transactions were successfully retrieved.
        if (block && block.transactions) {
            // Loop through each transaction contained within the block.
            for (const tx of block.transactions) {
                // A transaction is identified as a "contract creation" when its 'to' address is `null`.
                // This means it's not sending ETH to an existing account, but creating a new contract.
                if (tx.to === null) {
                    console.log(`\n🎉 Success! The first contract creation transaction has been found.`);
                    console.log("-------------------------------------------------");
                    console.log(`Block Number: ${tx.blockNumber}`);
                    console.log(`Transaction Hash: ${tx.hash}`);
                    console.log(`Creator Address (From): ${tx.from}`);
                    console.log("-------------------------------------------------");

                    // Once we find it, we can exit the function.
                    return;
                }
            }
        } else {
            console.log(`Error: Could not retrieve block ${searchBlock} or it contains no transactions.`);
        }
    } catch (error) {
        // Catch and display any errors that occur during the API call.
        console.error("An error occurred during the search:", error);
    }
}

// Call the main function to start the script.
findFirstContractCreation();