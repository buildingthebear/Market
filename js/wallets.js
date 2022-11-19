require('dotenv').config({path: '../config/.env'});

const Web3 = require("web3");
const walletConnectProvider = require("@walletconnect/web3-provider");
const provider = new walletConnectProvider.default({
    rpc: {
        97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    },
});

let web3 = new Web3(provider);

// connect wallet and store address
$('#connectWallet').click(function() {
    getAccount();
});

$('#donate').click(function() {
    donate();
});

// verify wallet by signing proof
$("#verifyWallet").click(async function (event) {
    let message = "verification proof for rnchp.mn";
    console.log(message);

    const from = acc
    const msg = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
    const sign = await ethereum.request({
        method: 'personal_sign',
        params: [msg, from],
    }).then(function () {
        $('#verifyWallet').hide();
        $("#walletConnection").addClass("verifiedWallet");
        $("#connectedWalletAddress").text("verified: " + acc);
    });
});

const initialize = () => {
    console.log(process.env.NEWS_API_KEY)
};

window.addEventListener('DOMContentLoaded', initialize);