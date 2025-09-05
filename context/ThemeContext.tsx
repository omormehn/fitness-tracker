import { COLORS } from "@/theme/Colors";
import { GRADIENTS } from "@/theme/gradients";
import { getImages } from "@/theme/images";
import { createContext, useContext, useState } from "react";


const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<ThemeType>('light')

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    const value: ThemeContextProps = {
        theme,
        colors: COLORS[theme],
        gradients: GRADIENTS[theme],
        images: getImages(theme),
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