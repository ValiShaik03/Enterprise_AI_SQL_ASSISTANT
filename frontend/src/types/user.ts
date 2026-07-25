export interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  last_login?: string | null;
}