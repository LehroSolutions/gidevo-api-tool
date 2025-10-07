export declare class AuthService {
    private configDir;
    private configFile;
    login(token: string): Promise<void>;
    getToken(): string | null;
    logout(): void;
}
//# sourceMappingURL=auth.d.ts.map