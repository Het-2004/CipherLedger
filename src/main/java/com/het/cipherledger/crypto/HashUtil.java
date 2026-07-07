package com.het.cipherledger.crypto;

import com.het.cipherledger.config.Constants;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;


public final class HashUtil {


    private HashUtil() {

    }



    public static String generateHash(String input) {

        try {


            MessageDigest digest =
                    MessageDigest.getInstance(
                            Constants.HASH_ALGORITHM
                    );


            byte[] bytes =
                    digest.digest(
                            input.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );


            StringBuilder builder =
                    new StringBuilder();



            for(byte b : bytes) {


                String hex =
                        Integer.toHexString(
                                0xff & b
                        );


                if(hex.length()==1) {

                    builder.append('0');

                }


                builder.append(hex);

            }


            return builder.toString();



        }catch(Exception e){


            throw new RuntimeException(
                    "Hash generation failed",
                    e
            );

        }

    }

}