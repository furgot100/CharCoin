require('dotenv').config();

import Web3 from "web3";
import charArtifact from "../../build/contracts/CharContract.json";
import fleek from '@fleekhq/fleek-storage-js';


// Credit: https://github.com/truffle-box/webpack-box/blob/master/app/src/index.js
const App = {
    web3: null,
    account: null,
    charContract: null,

    start: async function () {
        const { web3 } = this;
        window.ethereum.enable()

        try {
            // Get contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = charArtifact.networks[networkId];
            this.charContract = new web3.eth.Contract(
                charArtifact.abi,
                deployedNetwork.address,
            );

            // Get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
        } catch (error) {
            console.error("Could not connect to contract or chain: ", error);
        }
    },

    generateRandomCharData: async function (to) {
        // Char specs
        var charStats = {
            health: `${Math.round(Math.random() * 1000)} HP`,
            mp: `${Math.round(Math.random() * 400) + 30} MP`,
            level: (Math.random() * 9 + 1).toFixed(2)
            
        }
        // Build the metadata.
        var metadata = {
            "name": "crypto character",
            "description": `A character on the blockchain.`,
            "Health": charStats.health,
            "MP": charStats.mp,
            "Level": charStats.level,
            "timestamp": new Date().toISOString()
        };

        // Configure the uploader.
        const uploadMetadata = {
            apiKey: process.env.FLEEK_KEY,
            apiSecret: process.env.FLEEK_SECRET,
            key: `metadata/${metadata.timestamp}.json`,
            data: JSON.stringify(metadata),
        };

        // Tell the user we're generating the char
        this.setStatus("Generating a character... please wait, it can take a while!");

        // Add the metadata to IPFS first, because our contract requires a
        // valid URL for the metadata address.
        const result = await fleek.upload(uploadMetadata);

        // Once the file is added, then we can send a char
        this.awardItem(to, result.publicUrl, charStats);
    },

    awardItem: async function (to, metadataURL, metadata) {
        // Fetch the awardItem method from our contract.
        const { awardItem } = this.charContract.methods;

        // Award the char
        await awardItem(to, metadataURL).send({ from: this.account });

        // Set the status and show the char generated.
        this.setStatus(`Character generated! Here are the stats for your character :
        <br/>
        <ul>
            <li>Health: ${metadata.Health}</li>
            <li>MP: ${metadata.MP}</li>
            <li>Level: ${metadata.Level}</li>
        </ul>
        View the metadata <a href="${metadataURL}" target="_blank">here</a>.
        `);
    },

    setStatus: function (message) {
        $('#status').html(message);
    }
};

window.App = App;

// When all the HTML is loaded, run the code in the callback below.
$(document).ready(function () {
    // Detect Web3 provider.
    if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        window.ethereum.enable(); // get permission to access accounts
    } else {
        console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",);
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(
            new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
        );
    }
    // Initialize Web3 connection.
    window.App.start();

    // Capture the form submission event when it occurs.
    $("#char-form").submit(function (e) {
        // Run the code below instead of performing the default form submission action.
        e.preventDefault();

        // Capture form data and create metadata from the submission.
        const to = $("#to").val();

        window.App.generateRandomCharData(to);
    });
});