export interface AuthConfig {
    token: string;
    userId: string;
    expiresAt: string;
}
export declare class AuthService {
    private configDir;
    private configFile;
    login(token: string): Promise<void>;
    getToken(): string | null;
    /**
     * Get the full authentication configuration
     */
    getConfig(): AuthConfig | null;
    /**
     * Check if currently authenticated with valid token
     */
    isAuthenticated(): boolean;
    /**
     * Check if token is expired
     */
    isTokenExpired(): boolean;
    /**
     * Get remaining token validity in days
     */
    getTokenValidityDays(): number | null;
    logout(): void;
    /**
     * Get the config directory path
     */
    getConfigDir(): string;
}
//# sourceMappingURL=auth.d.ts.map