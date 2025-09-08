
export const getImages = (theme: 'light' | 'dark') => {
    const images = {
        light: {
            goal1: require('@/assets/images/light/goal1.svg'),
            goal2: require('@/assets/images/light/goal2.svg'),
            goal3: require('@/assets/images/light/goal3.svg'),
        },
        dark: {
            goal1: require('@/assets/images/dark/goal1.svg'),
            goal2: require('@/assets/images/dark/goal2.svg'),
            goal3: require('@/assets/images/dark/goal3.svg'),
        },
    }

    return images[theme]
}