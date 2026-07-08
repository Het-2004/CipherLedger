package com.het.cipherledger.crypto;

import java.util.ArrayList;
import java.util.List;

public class MerkleTree {

    public static String getMerkleRoot(List<String> hashes) {

        if (hashes == null || hashes.isEmpty()) {
            return "";
        }

        List<String> current = new ArrayList<>(hashes);

        while (current.size() > 1) {

            List<String> next = new ArrayList<>();

            for (int i = 0; i < current.size(); i += 2) {

                String left = current.get(i);

                String right =
                        (i + 1 < current.size())
                                ? current.get(i + 1)
                                : left;

                next.add(
                        HashUtil.generateHash(left + right)
                );
            }
            current = next;
        }
        return current.get(0);
    }
}