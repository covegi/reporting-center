export type UserRole = 'admin' | 'super-user' | 'user';

export interface User {
  id: string;
  role: UserRole;
  email: string;
  organization: string;
  name: string;
  reports: Array<string>;
}
