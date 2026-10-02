'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, StoredAgentCredential } from '@/types/auth';
import { Property } from '@/types/property';
import { INITIAL_PROPERTIES } from '@/data/mockProperties';

const STORAGE_KEY_AGENTS = 'samsher_registered_agents_v1';
const STORAGE_KEY_ACTIVE_USER = 'samsher_active_user_v1';
const STORAGE_KEY_PROPERTIES = 'samsher_properties_v1';

// Seed demo agent credentials for immediate testing
const INITIAL_DEMO_AGENTS: StoredAgentCredential[] = [
  {
    id: 'agent-demo-1',
    name: 'Rohan Deshmukh',
    email: 'agent@samsherproperties.in',
    passwordHash: 'Password123',
    role: 'agent',
    reraNumber: 'PRM/KA/RERA/1251/446/PR/200123',
    phone: '+91 70110 07968',
    agencyName: 'Samsher Verified Partner Agency',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'admin-demo-1',
    name: 'Admin Director',
    email: 'admin@samsherproperties.in',
    passwordHash: 'AdminPassword123',
    role: 'admin',
    reraNumber: 'DEL/RERA/HQ/2026/001',
    phone: '+91 70110 07968',
    agencyName: 'Samsher Real Estate Compliance HQ',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date().toISOString(),
  },
];

interface RegisterAgentParams {
  name: string;
  email: string;
  password: string;
  reraNumber?: string;
  phone?: string;
  agencyName?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: 'buyer' | 'agent' | 'admin';
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => { success: boolean; error?: string };
  registerAgent: (params: RegisterAgentParams) => { success: boolean; error?: string; user?: AuthUser };
  logout: () => void;
  demoAgentCredentials: { email: string; password: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      // Ensure seed demo agents exist in localStorage
      const existingAgentsRaw = localStorage.getItem(STORAGE_KEY_AGENTS);
      if (!existingAgentsRaw) {
        localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(INITIAL_DEMO_AGENTS));
      }

      // Restore active user session if exists
      const savedUser = localStorage.getItem(STORAGE_KEY_ACTIVE_USER);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Error loading auth from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Helper to retrieve all registered agents
  const getStoredAgents = (): StoredAgentCredential[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_AGENTS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error reading agents:', e);
    }
    return INITIAL_DEMO_AGENTS;
  };

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const agents = getStoredAgents();
    const matched = agents.find(
      (a) => a.email.toLowerCase() === cleanEmail && a.passwordHash === cleanPass
    );

    if (!matched) {
      return {
        success: false,
        error: 'Invalid agent email or password. Please verify credentials or register as a new agent.',
      };
    }

    const authUser: AuthUser = {
      id: matched.id,
      name: matched.name,
      email: matched.email,
      role: matched.role,
      reraNumber: matched.reraNumber,
      agencyName: matched.agencyName,
      phone: matched.phone,
      avatarUrl: matched.avatarUrl,
    };

    setUser(authUser);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(authUser));
    } catch (e) {
      console.error('Error saving active user:', e);
    }

    setIsAuthModalOpen(false);
    return { success: true };
  };

  const registerAgent = ({
    name,
    email,
    password,
    reraNumber,
    phone,
    agencyName,
  }: RegisterAgentParams): { success: boolean; error?: string; user?: AuthUser } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanName = name.trim();
    const cleanRera = reraNumber ? reraNumber.trim() : undefined;

    if (!cleanName || !cleanEmail || !cleanPass) {
      return { success: false, error: 'Full name, email, and password are required.' };
    }

    if (cleanPass.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const agents = getStoredAgents();
    const exists = agents.some((a) => a.email.toLowerCase() === cleanEmail);
    if (exists) {
      return {
        success: false,
        error: 'An agent account with this email address already exists. Please login.',
      };
    }

    const newAgentCredential: StoredAgentCredential = {
      id: `agent-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      passwordHash: cleanPass,
      role: 'agent',
      reraNumber: cleanRera,
      phone: phone?.trim() || '+91 70110 07968',
      agencyName: agencyName?.trim() || 'Samsher RERA Certified Partner',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      createdAt: new Date().toISOString(),
    };

    const updatedAgents = [newAgentCredential, ...agents];
    try {
      localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(updatedAgents));
    } catch (e) {
      console.error('Error saving new agent:', e);
    }

    // Step 2 & 3: Check if this is the first agent in the system and auto-assign all default properties
    const realRegisteredAgents = updatedAgents.filter((a) => a.role === 'agent' && !a.id.includes('demo'));
    const totalAgents = updatedAgents.filter((a) => a.role === 'agent');
    const isFirstAgent = realRegisteredAgents.length === 1 || totalAgents.length === 1;

    if (isFirstAgent) {
      try {
        let currentProperties: Property[] = [];
        const storedPropsRaw = localStorage.getItem(STORAGE_KEY_PROPERTIES);
        if (storedPropsRaw) {
          try {
            currentProperties = JSON.parse(storedPropsRaw);
          } catch {
            currentProperties = [...INITIAL_PROPERTIES];
          }
        } else {
          currentProperties = [...INITIAL_PROPERTIES];
        }

        // Loop through all existing properties in the state/database and update their agentId to match this newly created agent
        const reallocatedProperties: Property[] = currentProperties.map((prop) => ({
          ...prop,
          agentId: newAgentCredential.id,
          ownerId: newAgentCredential.id,
          agent: {
            ...prop.agent,
            id: newAgentCredential.id,
            name: `${newAgentCredential.name} (You)`,
            phone: newAgentCredential.phone || prop.agent?.phone || '+917011007968',
            whatsapp: newAgentCredential.phone
              ? newAgentCredential.phone.replace(/\D/g, '')
              : prop.agent?.whatsapp || '+917011007968',
            agencyName: newAgentCredential.agencyName || prop.agent?.agencyName || 'Samsher Properties',
          },
        }));

        localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(reallocatedProperties));
        localStorage.setItem('samsher_first_agent_assigned', newAgentCredential.id);

        // Notify active views immediately
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('samsher_properties_updated', { detail: reallocatedProperties })
          );
        }
      } catch (err) {
        console.error('Error assigning default properties to first agent:', err);
      }
    }

    // Automatically log in the newly registered agent
    const newAuthUser: AuthUser = {
      id: newAgentCredential.id,
      name: newAgentCredential.name,
      email: newAgentCredential.email,
      role: 'agent',
      reraNumber: newAgentCredential.reraNumber,
      agencyName: newAgentCredential.agencyName,
      phone: newAgentCredential.phone,
      avatarUrl: newAgentCredential.avatarUrl,
    };

    setUser(newAuthUser);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_USER, JSON.stringify(newAuthUser));
    } catch (e) {
      console.error('Error saving active user:', e);
    }

    setIsAuthModalOpen(false);
    return { success: true, user: newAuthUser };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_USER);
    } catch (e) {
      console.error('Error clearing active user:', e);
    }
  };

  const openLoginModal = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalTab('register');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const role: 'buyer' | 'agent' | 'admin' = user ? user.role : 'buyer';
  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAuthModalOpen,
        authModalTab,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
        login,
        registerAgent,
        logout,
        demoAgentCredentials: {
          email: 'agent@samsherproperties.in',
          password: 'Password123',
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
