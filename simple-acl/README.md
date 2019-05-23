# `Nodejs Chaincode` simple-acl code
This tutorial will explain how to write `Hyperledger Fabric` chaincode based on `Nodejs` with the ACL(Acces Control List) feature.
The identity who instantiates a chaincode becomes the Admin and each identity can access their asset.
The Admin can access any asset.

This is just one example. You can code the ACL feature in many ways.
                            
# Environment
+ `Nodejs`
+ `Hyperledger Fabric`

```

This starts the chaincode process and listens for incoming endorsement requests
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
There are two examples in ``simple-acl chaincode``
1) put and get
2) put2 and get2

You can choose either way to implement the user ACL feature or implement your own way to do it.
 

1. Sets the key as the invoker's address in put function and in the get function, parses the invoker's address from the certificate to use it.
  
``put``
```bash
docker exec cli peer chaincode invoke -o orderer.example.com:7050 -C bezant-channel -n simple-acl-node --peerAddresses peer0.bezant.example.com:7051 -c '{"Args":["put", "10"]}'
```

``get``
```bash
docker exec cli peer chaincode query -C bezant-channel -n simple-acl-node --peerAddresses peer0.bezant.example.com:7051 -c '{"Args":["get"]}'
```

2. Sets the key as the invoker's address on the example above, but in this function the key is set by the provided parameter where it sets the invoker's address as a value.
   This checks the if invoker's address is the same as the address stored through put2 function in get2 function. 
   
``put2``
```bash
docker exec cli peer chaincode invoke -o orderer.example.com:7050 -C bezant-channel -n simple-acl-node --peerAddresses peer0.bezant.example.com:7051 -c '{"Args":["put2", "a", "10"]}'
```

``get2``
```bash
docker exec cli peer chaincode query -C bezant-channel -n simple-acl-node --peerAddresses peer0.bezant.example.com:7051 -c '{"Args":["get", "a"]}'
```



``Instantiate``
When instantiating, this sets the invoker's address as the value of the key for 'Admin'.
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
