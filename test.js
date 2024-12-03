const ethers = require("ethers");
require('dotenv').config();

let provider = new ethers.JsonRpcProvider(process.env.GETH_API);

async function main() {
    const blockNumber = await provider.getBlockNumber(); // 获取当前区块号
    const block = await provider.getBlock(blockNumber); // 获取区块数据
    console.log(block);
}
main();