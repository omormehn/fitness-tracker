
export const getImages = (theme: 'light' | 'dark') => {
    const images = {
        light: {
            goal1: require('@/assets/images/light/goal1.png'),
            goal2: require('@/assets/images/light/goal2.png'),
            goal3: require('@/assets/images/light/goal3.png'),
            registerblob: require('@/assets/images/light/registerblob.png'),
            regsuccess: require('@/assets/images/light/regsuccess.png'),
        },
        dark: {
            goal1: require('@/assets/images/dark/goal1.png'),
            goal2: require('@/assets/images/dark/goal2.png'),
            goal3: require('@/assets/images/dark/goal3.png'),
            registerblob: require('@/assets/images/dark/registerblob.png'),
            regsuccess: require('@/assets/images/dark/regsuccess.png'),
        },
    }

    return images[theme]
}