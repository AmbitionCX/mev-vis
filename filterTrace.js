const fs = require('fs');
const path = require('path');
const ethers = require("ethers");
require('dotenv').config()

const provider = new ethers.JsonRpcProvider(process.env.GETH_API)

// Define the tracer function
const tracer = {
    retVal: [],
    step: function (log, db) { this.retVal.push(log.getPC() + ':' + log.op.toString()) },
    fault: function (log, db) { this.retVal.push('FAULT:' + JSON.stringify(log)) },
    result: function (ctx, db) { return this.retVal }
}

const call_tracer = async (txHash) => {
    try {
        const result = await provider.send('debug_traceTransaction', [txHash, tracer]);
        
        const destination = './Results';
        if (!fs.existsSync(destination)){ fs.mkdirSync(destination);} // make dir when not exist
        const filePath = path.join(destination, `Trace_${txHash}.txt`);
        fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

        console.log(`Trace saved to ${filePath}`);    
    } catch (error) {
        console.error('Error tracing transaction:', error);
    }
};

// Execute the tracer function
call_tracer("0x1746c86dfab0dbb1e3cf60b37b96391fcaad0b7879f3c63bfd650f2eecffb87c")








