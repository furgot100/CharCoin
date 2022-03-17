# Crypto Characters
An ERC-721 Token that generates a random character

### Prerquisites 
* Docker
* Metamask
* Infura
* Fleek

### Usage
Clone the repository
```
$ git clone https://github.com/furgot100/CharCoin.git
```

Install dependencies
```
$ npm i
```

Compile the smart contract
```
$ truffle compile
```

Migrate the contract. Make sure to have a .env file with you keys from Metamask, Infura, and Fleek. If keys are not provided the contract will not migrate.
```
$ truffle migrate --network rinkeby
```

Finally build the app
```
$ npm run dev
```


### Resources

Contract created see status at https://rinkeby.etherscan.io/address/0x44cc93dfFD49465597926317DDEa825a5c91251B

Contract address 0x44cc93dfFD49465597926317DDEa825a5c91251B