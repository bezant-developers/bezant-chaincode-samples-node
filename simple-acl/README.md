# `Nodejs Chaincode` simple-acl code
This tutorial will explain how to write `Hyperledger Fabric` chain code based on `Nodejs` with acl feature.
The identity who instantiate a chaincode becomes an admin, and each identity can access their asset.
Admin can access to any asset.
This is just one example. You can code acl feature in many ways.
                            
# Environment
+ `Nodejs`
+ `Hyperledger Fabric`

```

Start the chaincode process and listen for incoming endorsement requests
```js
shim.start(new SimpleACL());
```

## Compress nodejs files cli
``` console
zip -r chaincode.zip package.json simpleACL.js chaincodeUtil.js
```

## Local environment test
[bezant-chaincode-test-network link](https://github.com/bezant-developers/bezant-chaincode-test-network)


## Function explanation

1. sets key as the invoker's address in put function, and no parameters in get function.
   parses the invoker's address from the certificate and use it.
  
``put``
```bash
docker exec cli peer chaincode invoke -o orderer.example.com:7050 -C bezant-channel -n simple-acl-node --peerAddresses peer0.bezant.example.com:7051 -c '{"Args":["put", "10"]}'
```

``get``
```bash
docker exec cli peer chaincode query -C bezant-channel -n simple-acl-node --peerAddresses peer0.bezant.example.com:7051 -c '{"Args":["get"]}'
```

2. The above example, it sets key as the invoker's address, but in this functions we set key with provided parameter and it sets the invoker's address as a value.
   It checks the invoker's address is the same as the address stored through put2 function in get2 function. 
   
``put2``
```bash
docker exec cli peer chaincode invoke -o orderer.example.com:7050 -C bezant-channel -n simple-acl-node --peerAddresses peer0.bezant.example.com:7051 -c '{"Args":["put2", "a", "10"]}'
```

``get2``
```bash
docker exec cli peer chaincode query -C bezant-channel -n simple-acl-node --peerAddresses peer0.bezant.example.com:7051 -c '{"Args":["get", "a"]}'
```



``Instantiate``
When instantiating, it sets the invoker's address as the value of the key for 'Admin'.
```bash
docker exec cli peer chaincode install -n simple-acl-node -v 1.0 -l node -p /opt/gopath/src/simple-acl-node
docker exec cli2 peer chaincode install -n simple-acl-node -v 1.0 -l node -p /opt/gopath/src/simple-acl-node                                                                                            
docker exec cli peer chaincode instantiate -o orderer.example.com:7050 -C bezant-channel -n simple-acl-node -v 1.0 -c '{"Args":["init"]}'               
```

``Upgrade``
```bash
docker exec cli peer chaincode install -n simple-acl-node -v 1.1 -l node -p /opt/gopath/src/simple-acl-node
docker exec cli2 peer chaincode install -n simple-acl-node -v 1.1 -l node -p /opt/gopath/src/simple-acl-node                                                                                           
docker exec cli peer chaincode upgrade -o orderer.example.com:7050 -C bezant-channel -n simple-acl-node -v 1.1 -c '{"Args":["init"]}'               
```