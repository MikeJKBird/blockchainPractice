const crypto = require('crypto')
const algorithm = 'sha256'
const encoding = 'base64'

// A block is a wrapper around a piece of data to be stored stored
class Block {
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    //Returns the hash as a string
    calculateHash() {
        const hash = crypto.createHash(algorithm);
        return hash.update(this.index + this.previousHash + this.timestamp + this.data).digest(encoding)
    }
}

//A Blockchain is the storage structure
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    //creates the first Block in the blockchain
    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "Lift off");
    }

    //Returns the last Block to be added to the Blockchain
    getLatestBlock() {
        return this.chain[this.chain.length -1]
    }

    //Adds a given Block to the Blockchain
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    //Confirms the integrity of the data
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash != currentBlock.calculateHash()) {
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash) {
                return false;
            }

            return true;
        }
    }
}

// DEMO
let newChain = new Blockchain();
newChain.addBlock(new Block(1, "11/26/17", "did the first action"))
newChain.addBlock(new Block(2, "11/27/17", "second action"))
console.log(newChain);
console.log("Integrity maintained: " + newChain.isChainValid());
