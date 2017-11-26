const crypto = require('crypto');


class Block {
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    /**
    * Returns the hash as a string
    *
    **/
    calculateHash() {
        const hash = crypto.createHash('sha256');
        return hash.update(this.index + this.previousHash + this.timestamp + this.data).digest('hex')
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "Lift off");
    }

    getLatestBlock() {
        return this.chain[this.chain.length -1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

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

let newChain = new Blockchain();
newChain.addBlock(new Block(1, "11/26/17", "did the first action"))
newChain.addBlock(new Block(2, "11/27/17", "second action"))

console.log("Integrity maintained: " + newChain.isChainValid());
