package com.het.cipherledger.repository;


import com.het.cipherledger.model.Block;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface BlockRepository
        extends MongoRepository<Block,String> {


}