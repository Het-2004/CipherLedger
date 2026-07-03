package com.het.cipherledger.config;

/**
 * ============================================================================================
 * Project        :  CipherLedge
 * Description    :  Global configuration constants used throughout the blockchain application.
 * Author         :  Het
 * Version        :  1.0.0
 * =============================================================================================
 **/

public final class Constants {

    /**
     * private constructor to prevent object creation.
     */
    private Constants() {
        throw new UnsupportedOperationException("Constant class cannot be instantiated.");
    }

    // ============================================================
    // PROJECT INFORMATION
    // ============================================================

    public static final String PROJECT_NAME = "CipherLedger";
    public static final String PROJECT_VERSION = "1.0.0";
    public static final String PROJECT_AUTHOR = "Het";

    // ============================================================
    // BLOCKCHAIN CONFIGURATION
    // ============================================================

    /**
     * Hashing algorithm used throughout the blockchain.
     */
    public static final String HASH_ALGORITHM = "SHA-256";

    /**
     * Mining difficulty.
     * Example:
     * Difficulty = 4
     * Valid haash must begin with "0000"
     */
    public static final int MINING_DIFFICULTY = 4;

    /**
     * Reward given to the miner after successfully minig a block.
     */
    public static final double MINING_REWARD = 50.0;

    /**
     * Name of the Genesis Block.
     */
    public static final String GENESIS_DATA = "Genesis Block";

    /**
     * Previous hash of the Genesis BBlock.
     */
    public static final String GENESIS_PREVIOUS_HASH = "0";

    //    =============================================================
    //    DATE & TIME
    //    =============================================================

    /**
     * Timestamp format used across the application.
     */
    public static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

    // ============================================================
    // FILES
    // ============================================================

    /**
     * Blockchain storage file.
     */
    public static final String BLOCKCHAIN_FILE = "blockchain.json";

    /**
     * Wallet storage folder.
     */
    public static final String WALLET_DIRECTORY = "wallet";
}