import { updateUser } from './../server/controllers/authController';
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
  _id?: string;
  fullName: string;
  email: string;
  phone?: string;
  height: number;
  weight: number
  dob: Date
}

interface AuthState {
  user: null | User;
  token: string | null;
  loading: boolean;
  googleSignIn: () => Promise<boolean>;
  login: (data) => Promise<boolean>;
  register: (data) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data) => Promise<boolean>
  error: { field?: string | null, msg: string | null }
  hasOnboarded: boolean;
  setOnboarded: () => void;
  setAuth: (payload: { user: any; token: string }) => void;
  setError: (error: { field: string | null, msg: string | null }) => void
}

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  field: string;
  value: string;
  onSave: (value: string) => void;
  inputType?: 'text' | 'numeric' | 'email-address';
  unit?: string;
}