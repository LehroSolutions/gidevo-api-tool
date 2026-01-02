/**
 * Secrets Manager
 *
 * Handles secure storage of sensitive information like authentication tokens.
 * Tries to use system keychain (via keytar) if available, otherwise falls back
 * to an obfuscated file in the user's home directory with restricted permissions.
 */
export declare class SecretsManager {
    private serviceName;
    private accountName;
    private configDir;
    private secretsFile;
    private keytar;
    private initialized;
    private initPromise;
    constructor();
    /**
     * Ensure the secrets manager is initialized (lazy initialization)
     */
    private ensureInitialized;
    private init;
    /**
     * Store a secret securely
     */
    setSecret(key: string, value: string): Promise<void>;
    /**
     * Retrieve a secret
     */
    getSecret(key: string): Promise<string | null>;
    /**
     * Delete a secret
     */
    deleteSecret(key: string): Promise<void>;
    private getEncryptionKey;
    private saveToFile;
    private loadFromFile;
    private deleteFromFile;
    private encrypt;
    private decrypt;
}
//# sourceMappingURL=secrets.d.ts.map