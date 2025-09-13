import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@react-navigation/native';

interface LineChartProps {
    theme: 'light' | 'dark';
    width?: number;
    graphFrom: string;
    graphTo: string;
}
const screenWidth = Dimensions.get("window").width;

const LineChartComponent = ({ theme, width, graphFrom, graphTo }: LineChartProps) => {

    const lineChartBGFrom = theme === 'dark' ? '#2a2940' : '#e5daf5';
    const lineChartBGTo = theme === 'dark' ? '#2a2940' : '#e5daf5';
    return (
        <View>
            <LineChart
                data={{
                    labels: ["", "", "", "", "", ""],
                    datasets: [
                        {
                            data: [65, 72, 78, 75, 80, 78],
                        },
                    ],
                }}
                width={width!}
                height={180}
                chartConfig={{
                    backgroundGradientFrom: graphFrom,
                    backgroundGradientTo: graphTo,
                    decimalPlaces: 0,
                    color: (opacity = 2) => `rgba(138, 43, 226, ${opacity})`,
                    labelColor: () => "#aaa",
                    propsForDots: {
                        r: "4",
                        strokeWidth: "1",
                        stroke: "#fff",
                    },
                }}

                style={{ marginVertical: 10, borderRadius: 12 }}
            />
        </View>
    )
}

export default LineChartComponent;

const styles = StyleSheet.create({})