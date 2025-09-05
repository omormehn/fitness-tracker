type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;
  colors: typeof COLORS.light;
  gradients: typeof GRADIENTS.light;
  images: ReturnType<typeof getImages>;
  toggleTheme: () => void;
}