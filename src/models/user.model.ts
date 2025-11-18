export type UserRole = 'Administrator' | 'User';

export interface User {
  username: string;
  role: UserRole;
}
