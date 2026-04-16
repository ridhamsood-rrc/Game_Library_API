export interface AuthorizationOptions {
    hasRole: Array<"admin" | "manager" | "freeuser" | "premiumUser">;
    allowSameUser?: boolean;
}