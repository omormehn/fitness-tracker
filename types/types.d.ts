
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
  height?: number;
  weight?: number;
  dob?: Date;
  gender?: string
}

interface AuthState {
  user: null | User;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  initialized: boolean;
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
  initializeAuthState: () => Promise<void>;
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

interface ChartBarData {
    day: string;
    value: number;
    gradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
}

interface BarItemProps {
    day: string;
    value: number;
    maxValue: number;
    gradient: readonly [ColorValue, ColorValue, ...ColorValue[]];
    delay: number;
    bgColor: string;
}

// WORKOUT
interface WorkoutData {
  day: string;
  value: number;
  isActive?: boolean;
}

interface UpcomingWorkout {
  id: string;
  title: string;
  time: string;
  icon: string;
  enabled: boolean;
}

interface WorkoutProgram {
  id: string;
  title: string;
  exercises: number;
  duration: string;
  image: string;
}
