export interface AuthorizationOptions {
    hasRole: Array<"admin" | "manager" | "freeUser" | "premiumUser">;
    allowSameUser?: boolean;
}