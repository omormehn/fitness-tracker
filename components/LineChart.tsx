import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@react-navigation/native';

interface LineChartProps {
    theme: 'light' | 'dark';
    width?: number;
    graphFrom: string;
    graphTo: string;
    data?: number[];
    labels?: string[];
}
const screenWidth = Dimensions.get("window").width;

const LineChartComponent = ({ theme, width, graphFrom, graphTo, data, labels }: LineChartProps) => {

    const chartWidth = width ?? screenWidth;

    return (
        <View>
            <LineChart
                data={{
                    labels: labels ?? ["", "", "", "", "", ""],
                    datasets: [
                        {
                            data: data ?? [65, 72, 78, 75, 80, 78],
                        },
                    ],
                }}
                width={chartWidth}
                height={180}
                chartConfig={{
                    backgroundGradientFrom: graphFrom,
                    backgroundGradientTo: graphTo,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(138, 43, 226, ${opacity})`,
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