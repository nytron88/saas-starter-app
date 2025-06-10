export {}

// Define the possible user roles
export type UserRole = "admin" | "user"

declare global {
  // Clerk's official interface for custom JWT session claims
  interface CustomJwtSessionClaims {
    metadata: {
      role?: UserRole
    }
  }

  // Clerk's official interface for user public metadata
  interface UserPublicMetadata {
    role?: UserRole
  }
} 