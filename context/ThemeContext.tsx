import { COLORS } from "@/theme/Colors";
import { GRADIENTS } from "@/theme/gradients";
import { getImages } from "@/theme/images";
import { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";


const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>('light')
    const systemTheme = useColorScheme() as ThemeType

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const value: ThemeContextProps = {
        theme: systemTheme,
        colors: COLORS[systemTheme] || COLORS,
        gradients: GRADIENTS[systemTheme] || GRADIENTS,
        images: getImages(systemTheme),
        toggleTheme,
    };


    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used inside ThemeProvider');
    return context;
};