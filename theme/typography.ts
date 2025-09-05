// theme/typography.ts
import { StyleSheet } from "react-native";

export const typography = StyleSheet.create({
    h1: {
        fontFamily: "PoppinsBold",
        fontSize: 32,
        lineHeight: 40,
    },
    h2: {
        fontFamily: "PoppinsSemiBold",
        fontSize: 24,
        lineHeight: 32,
    },
    body: {
        fontFamily: "PoppinsRegular",
        fontSize: 16,
        lineHeight: 24,
    },
    caption: {
        fontFamily: "PoppinsMedium",
        fontSize: 12,
        lineHeight: 18,
    },
});
