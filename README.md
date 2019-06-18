# Hypledger fabric chaincode samples nodejs
- [Simple](simple): Basic example that uses chaincode to query and execute transaction
- [simple-acl](simple-acl): Basic example with acl.

## Upload partner admin site
### 1. Download file and upload  
- [simple-node.zip](simple/simple-node.zip): You have to **download zip file** and upload
- [simple-acl-node.zip](simple-acl/simple-acl-node.zip): You have to **download zip file** and upload

### 2. Compress source file and upload
- Only **package.json**, **source(js, src)** files need to be compressed
    ``` console
    zip -r chaincode.zip package.json simpleChaincode.js chaincodeUtil.js
    ```
## Environment
+ `Nodejs`
+ `Hyperledger Fabric`

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

## Local environment test
[bezant-chaincode-test-network link](https://github.com/bezant-developers/bezant-chaincode-test-network)