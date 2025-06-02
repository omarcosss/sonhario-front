import { Colors } from '@/constants/Colors';
import React, { useState, useEffect, FC } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Svg, Rect, Line } from 'react-native-svg'; // Using Rect for simplicity, can be extended with Path for more complex shapes

// --- Type Definitions ---
interface SleepRecord {
  day: DayOfWeek;
  hours: number;
}

type DayOfWeek = 'Dom' | 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sab';

interface RoundedBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface SleepChartProps {
  /**
   * Array of sleep records for the last 7 days.
   * Can be less than 7 days, or include days with 0 hours.
   * The component will fill in missing days with 0 hours.
   */
  sleepDataLast7Days?: (SleepRecord | null | undefined)[]; // Allow null/undefined for days not yet recorded
}

// --- Helper Component for Bar ---
const RoundedBar: FC<RoundedBarProps> = ({ width, height, x, y, color }) => {
  if (height <= 0) return null; // Don't render if no height

  const barRadius = Math.min(width / 2); // Adjust radius as needed

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      stroke={Colors.Astronaut[400]}
      rx={barRadius} // For rounded corners
      ry={barRadius} // For rounded corners
    />
  );
};

const SleepChart: FC<SleepChartProps> = ({ sleepDataLast7Days }) => {
  const [processedData, setProcessedData] = useState<SleepRecord[]>([]);
  const [maxSleepHours, setMaxSleepHours] = useState<number>(1); // Default to 1 to avoid division by zero

  const daysOrder: DayOfWeek[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const chartHeight = 130; // Max height of the chart area
  const barWidth = 30; // Width of each bar
  const barMargin = 10; // Margin between bars
  const totalChartWidth = (barWidth + barMargin) * daysOrder.length - barMargin;

  useEffect(() => {
    let maxHours = 0;
    const currentWeekData: SleepRecord[] = daysOrder.map(dayName => {
      const foundDay = sleepDataLast7Days?.find(
        (d): d is SleepRecord => d !== null && d !== undefined && d.day === dayName
      );
      const hours = foundDay ? foundDay.hours : 0;
      if (hours > maxHours) {
        maxHours = hours;
      }
      return { day: dayName, hours };
    });

    setMaxSleepHours(maxHours > 0 ? maxHours : 1); // Avoid division by zero, ensure a baseline
    setProcessedData(currentWeekData);

  }, [sleepDataLast7Days]);

  if (!processedData.length && !sleepDataLast7Days) {
    // Optional: Show a loading state or a message if data is still being fetched or not provided
    return <Text style={styles.loadingText}>Loading sleep data...</Text>;
  }
  // If sleepDataLast7Days is explicitly an empty array or all nulls, processedData will exist but with 0 hours.

  return (
    <View style={styles.container}>
      <View style={styles.chartArea}>
        <Svg height={chartHeight} width={totalChartWidth}>
            <Line
                x1="0"
                y1={chartHeight}
                x2={totalChartWidth}
                y2={chartHeight}
                stroke={Colors.Astronaut[200]}
                strokeWidth="1"
            />
            {/* Horizontal Grid Lines */}
            {[1, 2, 3].map((n) => {
                // Calculate Y position for each line.
                // For 3 lines, they could represent, for example, 1/4, 1/2, and 3/4 of the chart height.
                // Or, if your top padding is 10% (0.9 factor for bars), you might want the lines within that 90% space.
                // Let's assume lines are within the same 90% space as the bars for this example.
                const yPositionGrid = (chartHeight * 1 / 4) * n; // Divide by 4 for 3 lines to get 1/4, 2/4, 3/4 marks

                return (
                <Line
                    key={`grid-line-${n}`}
                    x1="0" // Start from the left edge
                    y1={chartHeight - yPositionGrid} // SVG y starts from top, so subtract from total height
                    x2={totalChartWidth} // Extend to the right edge
                    y2={chartHeight - yPositionGrid}
                    stroke='#CAD9F333' // A light color for the grid lines
                    strokeWidth="1" // Adjust thickness as needed
                />
                );
            })}

            {/* Your Bar Chart */}
            {processedData.map((dayData, index) => {
                // Ensure barHeight calculation is safe
                const barScaleFactor = maxSleepHours > 0 ? dayData.hours / maxSleepHours : 0;
                const barHeight = dayData.hours > 0 ? barScaleFactor * chartHeight * 0.9 : 0; // 0.9 to leave some top padding
                
                const xPosition = index * (barWidth + barMargin);
                const yPosition = chartHeight - barHeight; // SVG y starts from top

                if (dayData.hours === 0 || barHeight <= 0) {
                // Render a minimal line or placeholder for no-data days.
                return (
                    <Rect
                    key={`${dayData.day}-${index}-empty`}
                    x={xPosition + (barWidth / 2) - 1} // Centered small line
                    y={chartHeight - 2} // At the bottom
                    width={2}
                    height={2}
                    fill="#555F7C" 
                    />
                );
                }
                return (
                <RoundedBar
                    key={`${dayData.day}-${index}`}
                    x={xPosition}
                    y={yPosition - 3}
                    width={barWidth}
                    height={barHeight}
                    color="#4767C926" 
                />
                );
            })}
        </Svg>
      </View>
      <View style={styles.labelsContainer}>
        {processedData.map((dayData, index) => (
          <Text key={`${dayData.day}-${index}-label`} style={styles.label}>
            {dayData.day}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: (30 + 10) * 7,
  },
  chartArea: {
    // flexDirection: 'row', // Svg handles its children's layout
    // alignItems: 'flex-end', // Bar y position handles this
    height: 130, // Set a fixed height for the chart area
    marginBottom: 10,
    // Grid lines could be added here using more Svg <Line> elements if desired
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 1,
    width: '100%',
    // paddingHorizontal: 5, // Labels will align under bars due to barWidth & barMargin logic
  },
  label: {
    color: Colors.Astronaut[100], // Light text color from image
    fontSize: 12,
    textAlign: 'center',
    width: 30, // barWidth
    marginHorizontal: 5, // barMargin / 2 for centering
  },
  loadingText: {
    color: '#A0A8C4',
    padding: 20,
  }
});

export default SleepChart;