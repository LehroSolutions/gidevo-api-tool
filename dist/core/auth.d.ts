export interface AuthConfig {
    userId: string;
    expiresAt: string;
}
export declare class AuthService {
    private configDir;
    private configFile;
    private secrets;
    login(token: string): Promise<void>;
    getToken(): Promise<string | null>;
    /**
     * Get the full authentication configuration (excluding token)
     */
    getConfigSync(): AuthConfig | null;
    /**
     * Check if currently authenticated with valid token
     */
    isAuthenticated(): Promise<boolean>;
    /**
     * Check if token is expired
     */
    isTokenExpired(): boolean;
    /**
     * Get remaining token validity in days
     */
    getTokenValidityDays(): number | null;
    logout(): Promise<void>;
    /**
     * Get the config directory path
     */
    getConfigDir(): string;
}
//# sourceMappingURL=auth.d.ts.map