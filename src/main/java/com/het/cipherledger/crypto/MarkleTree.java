package com.het.cipherledger.crypto;

import java.util.List;

public class MarkleTree{
    public String BuildRoot(List<String> hashes){
        if (hashes == null || hashes.isEmpty()){
            return "";
        }

        while(hashes.size()>1){
            for(int i=0;i<hashes.size()-1;i++){
                hashes.set(i,HashUtil.generateHash(hashes.get(i)+hashes.get(i+1)));
            }
            hashes.remove(hashes.size()-1);
        }
        return hashes.get(0);
    }
}