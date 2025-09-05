import { RelativePathString } from "expo-router";

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
