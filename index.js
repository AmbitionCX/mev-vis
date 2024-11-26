const ethers = require("ethers");
require('dotenv').config()

let provider = new ethers.JsonRpcProvider(process.env.GETH_API)

provider.getBlockNumber().then( res => {
    console.log(res);
})

