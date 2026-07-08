package com.het.cipherledger.blockchain;

import com.het.cipherledger.model.Block;
import java.util.List;

public final class BlockchainValidator {

    public boolean validate(List<Block> chain){
        for(int i=1; i<chain.size(); i++){
            Block current = chain.get(i);
            Block previous = chain.get(i-1);

            if(!current.getHash().equals(current.calculateHash())){
               return false;
            }

            if(!current.getPreviousHash().equals(previous.getHash())){
                return false;
            }
        }
        return true;
    }
}