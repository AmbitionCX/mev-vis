const fs = require('fs');
const path = require('path');
const ethers = require("ethers");
require('dotenv').config()

const provider = new ethers.JsonRpcProvider(process.env.GETH_API)

const call_receipt = async (txHash) => {
    try {
        const result = await provider.getTransactionReceipt(txHash);
        
        const destination = './Results';
        if (!fs.existsSync(destination)){ fs.mkdirSync(destination);} // make dir when not exist
        const filePath = path.join(destination, `Receipt_${txHash}.txt`);
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

        console.log(`Receipt saved to ${filePath}`);
    } catch (error) {
        console.error('Error tracing transaction:', error);
    }
};

call_receipt("0x1746c86dfab0dbb1e3cf60b37b96391fcaad0b7879f3c63bfd650f2eecffb87c")