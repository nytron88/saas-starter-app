export {};

export type UserRole = "admin" | "user";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserRole;
    };
  }

  interface UserPublicMetadata {
    role?: UserRole;
  }
}
