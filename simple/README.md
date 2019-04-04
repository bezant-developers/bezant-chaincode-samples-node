# `Nodejs Chaincode` simple code
This tutorial will explain how to write `Hyperledger Fabric` chain code based on `Nodejs`

# Environment
+ `Nodejs`
+ `Hyperledger Fabric`


# `Chaincode` development example
Writing your own chain code requires an understanding of the `Fabric` platform, `Nodejs`. An application is a basic example chain code that creates assets (key-value pairs) on a ledger.

## Download code
```sh
$ git clone https://github.com/bezant-developers/bezant-chaincode-samples-node.git
```

## Basic code
```js
const shim = require('fabric-shim');

const SimpleChaincode = class {
    async Init(stub) {
        console.info('========= Init =========');
        return shim.success();
    }

    async Invoke(stub) {
        console.info('========= Invoke =========');
        return shim.success();
    }
};

shim.start(new SimpleChaincode());
```

## Function
Init is called during chaincode instantiation to initialize and chaincode upgrade also calls this function.
```js
async Init(stub) {
    console.info('========= Init =========');
    return shim.success();
}
```

The Invoke method is called in response to receiving an invoke transaction to process transaction proposals.
```js
async Invoke(stub) {
    console.info('========= Invoke =========');
    let ret = stub.getFunctionAndParameters();
    let func = this[ret.fcn];
    if (!func) {
        return shim.error('No function name :' + ret.fcn + ' found');
    }
    try {
        return await func(stub, ret.params);
    } catch (err) {
        return shim.error(err);
    }
}
```

Save the keys and values to the ledger.
```js
async put(stub, args) {
    if (args.length !== 2) {
        return shim.error('Incorrect number of arguments. Expecting 2');
    }

    let key = args[0],
        value = args[1];
        
    await stub.putState(key, Buffer.from(value));
    return shim.success();
}
```

Get returns the value of the specified asset key
``` js
async get(stub, args) {
    if (args.length !== 1) {
        return shim.error('Incorrect number of arguments. Expecting 1');
    }

    let resultValueBytes = await stub.getState(args[0]);

    if (resultValueBytes.length === 0) {
        return shim.error('Failed to get state for ' + args[0]);
    }
    
    return shim.success(resultValueBytes);
}
```

Start the chaincode process and listen for incoming endorsement requests
```js
shim.start(new SimpleChaincode());
```

## Compress nodejs files cli
``` console
zip -r chaincode.zip package.json simpleChaincode.js
```