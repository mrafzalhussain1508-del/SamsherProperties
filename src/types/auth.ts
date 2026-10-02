export type UserRole = 'buyer' | 'visitor' | 'agent' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'agent' | 'admin';
  reraNumber?: string;
  agencyName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface StoredAgentCredential {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In-memory/local mock hashed string
  role: 'agent' | 'admin';
  reraNumber?: string;
  phone?: string;
  agencyName?: string;
  avatarUrl?: string;
  createdAt: string;
}
