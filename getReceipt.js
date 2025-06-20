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

call_receipt("0x3579c9c56dbee98afe0fb0d4408ae45447d4a2f6cde98520f8c9c4f7e3861166")