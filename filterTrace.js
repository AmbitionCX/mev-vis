const ethers = require("ethers");
require('dotenv').config()

let provider = new ethers.JsonRpcProvider(process.env.GETH_API)

// Define the tracer function
const tracer = {
    retVal: [],
    step: function (log, db) { this.retVal.push(log.getPC() + ':' + log.op.toString()) },
    fault: function (log, db) { this.retVal.push('FAULT:' + JSON.stringify(log)) },
    result: function (ctx, db) { return this.retVal }
}
const tracerOptions = {
    reexec: 11565610,
    timeout: '6000s',
    tracer: String(tracer)
}

const call_racer = async (txHash) => {
    try {
        const result = await provider.send('debug_traceTransaction', [txHash, tracerOptions]);
        console.log('Trace Result:', result);
    } catch (error) {
        console.error('Error tracing transaction:', error);
    }
};

// Execute the tracer function
call_racer("0x543b0689e2c1b587d7dd8c09bb2e71f46eb9693ce37c8ca263b494acd182c02d")








