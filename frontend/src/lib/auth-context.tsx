'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApolloClient, gql } from '@apollo/client';
import { AuthContext, User, LoginData, SignUpData } from '@/types';
import { apolloClient as client } from './apollo-client';

const AuthContextInstance = createContext<AuthContext | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContextInstance);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const LOGIN_MUTATION = gql`
      mutation Login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
          access_token
          user {
            id
            email
            name
            role
            country
          }
        }
      }
    `;

    try {
      const response = await client.mutate<{ login: { access_token: string; user: User } }>({
        mutation: LOGIN_MUTATION,
        variables: {
          loginInput: { email, password },
        },
      });

      const loginData = response.data?.login;

      if (!loginData) {
        throw new Error('Login failed: no data returned');
      }

      const { access_token, user: userData } = loginData;
      
      setToken(access_token);
      setUser(userData);
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      const e = error as any; // Cast for Apollo-specific fields like graphQLErrors
      let message = e?.graphQLErrors?.[0]?.message || e?.message || 'Login failed';
      message = message.replace(/^(GraphQL error:|CombinedGraphQLErrors:)\s*/i, '');
      throw new Error(message);
    }
  };

  const signup = async (userData: SignUpData) => {
    const SIGNUP_MUTATION = gql`
      mutation SignUp($signUpInput: SignUpInput!) {
        signUp(signUpInput: $signUpInput) {
          access_token
          user {
            id
            email
            name
            role
            country
          }
        }
      }
    `;

    try {
      const response = await client.mutate<{ signUp: { access_token: string; user: User } }>({
        mutation: SIGNUP_MUTATION,
        variables: {
          signUpInput: userData,
        },
      });

      const signUpData = response.data?.signUp;

      if (!signUpData) {
        throw new Error('Signup failed: no data returned');
      }

      const { access_token, user: newUser } = signUpData;
      
      setToken(access_token);
      setUser(newUser);
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      const e = error as any; // Cast for Apollo-specific fields like graphQLErrors
      let message = e?.graphQLErrors?.[0]?.message || e?.message || 'Signup failed';
      message = message.replace(/^(GraphQL error:|CombinedGraphQLErrors:)\s*/i, '');
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    client.clearStore();
    router.push('/login');
  };

  const value: AuthContext = {
    user,
    token,
    login,
    logout,
    signup,
  };

  return (
    <AuthContextInstance.Provider value={value}>
      {children}
    </AuthContextInstance.Provider>
  );
};
