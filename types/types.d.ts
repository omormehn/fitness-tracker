import { TextInputProps, TextStyle } from 'react-native';

import React, { ComponentType, ReactElement } from 'react';

type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  colors: typeof COLORS.light;
  gradients: typeof GRADIENTS.light;
  images: ReturnType<typeof getImages>;
  toggleTheme: () => void;
}

interface OnboardingProps {
  lightImage: React.FC<any>;
  darkImage: React.FC<any>;
  title: string;
  description: string;
  route?: any;
};

export type InputContainerProps = {
  placeholder: string;
  iconName?: any;
  Icon?: ReactElement
  type?: 'text' | 'password';
  theme: ThemeType,
  width?: any
  inputWidth?: any
  value: string;
  onChangeText: (text: string) => void
} & TextInputProps

type Gender = { male: string, female: string };

interface CarouselProps {
  lightImage: React.FC<any>;
  darkImage: React.FC<any>;
  title: string;
  description: string;
  route?: any;
};


interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
}

interface AuthState {
  user: null | User;
  token: string | null;
  loading: boolean;
  login: (data) => Promise<boolean>;
  register: (data) => Promise<boolean>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  error: string | null
  hasOnboarded: boolean;
  setOnboarded: () => Promise<void>;
  checkOnboarding: () => Promise<void>;
}