export interface User {
  id: string; 
  role: "admin" | "super-user" | "user";
  email: string;
  name: string;
  reports: Array<string>;
}