enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

export interface RequestUser {
  userId: string;
  role: UserRole;
  isSystem: boolean;
}