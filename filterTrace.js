const ethers = require("ethers");
require('dotenv').config()

let provider = new ethers.JsonRpcProvider(process.env.GETH_API)

// Define the tracer function
const tracer = {
    retVal: [],
    step: function (log, db) { this.retVal.push(log.getPC() + ":" + log.op.toString()) },
    fault: function (log, db) { this.retVal.push("FAULT: " + JSON.stringify(log)) },
    result: function (ctx, db) { return this.retVal }
}

const call_racer = async (txHash) => {
    try {
        const result = await provider.send('debug_traceTransaction', [txHash, tracer]);
        console.log('Trace Result:', result);
    } catch (error) {
        console.error('Error tracing transaction:', error);
    }
};

// Execute the tracer function
call_racer("0xbcd09a31123bde8589dc03f25f4bbdb53a15f284490b4a9739675043ef2b601d");









