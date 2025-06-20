const fs = require('fs');
const path = require('path');
const ethers = require("ethers");
require('dotenv').config();

const provider = new ethers.JsonRpcProvider(process.env.GETH_API);

const tracerCode = `
{
  data: [],
  step: function(log) {
    this.data.push({
      depth: log.getDepth(),
      address: log.contract ? (log.contract.getAddress ? log.contract.getAddress() : log.contract.address) : null
    });
  },
  fault: function(log) {},
  result: function() { return this.data; }
}
`;

const call_tracer = async (txHash) => {
    try {
        // 1. structLogs trace
        const structlogTrace = await provider.send('debug_traceTransaction', [
            txHash
        ]);
        const steps = structlogTrace.structLogs.map(({ pc, op, stack, depth }) => ({ pc, op, stack, depth }));

        // 2. JS tracer for address
        const addressTrace = await provider.send('debug_traceTransaction', [
            txHash,
            { tracer: tracerCode }
        ]);

        // 3. 合并
        const merged = steps.map((step, i) => ({
            ...step,
            address: addressTrace[i] ? addressTrace[i].address : null
        }));

        // 4. 保存
        const destination = './Results';
        if (!fs.existsSync(destination)){ fs.mkdirSync(destination);}
        const filePath = path.join(destination, `Trace_${txHash}.txt`);
        fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));

        console.log(`Trace saved to ${filePath}`);
    } catch (error) {
        console.error('Error tracing transaction:', error);
    }
};

// Execute the tracer function
call_tracer("0xef39c19ceb07373914204e76019943d57e5c4e99760ec2a337a6e9d38a315fbc");








