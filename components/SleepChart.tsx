import { Colors } from '@/constants/Colors';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Line, Rect, Svg } from 'react-native-svg';

// --- Type Definitions ---
interface SleepRecord {
  // day property is now optional in the prop, as we derive it from the date.
  day?: DayOfWeek;
  hours: number;
  // The date is now the mandatory key for matching data.
  date: string; // <-- CHANGED: Expects 'YYYY-MM-DD' format
}

type DayOfWeek = 'Dom' | 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sab';

interface RoundedBarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  onPress?: () => void;
}

// Internal state now holds the generated day name
interface ProcessedSleepRecord {
    day: DayOfWeek;
    hours: number;
    date: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  day: DayOfWeek;
  hours: number;
  date?: string;
}

interface SleepChartProps {
  /**
   * Array of sleep records for the last 7 days.
   * The `date` property ('YYYY-MM-DD') is used for matching.
   */
  sleepDataLast7Days?: (SleepRecord | null | undefined)[];
}


// --- Helper Component for Bar (Unchanged) ---
const RoundedBar: FC<RoundedBarProps> = ({ width, height, x, y, color, onPress }) => {
  if (height <= 0) return null;

  const barRadius = Math.min(width / 2);

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={color}
      stroke={Colors.Astronaut[400]}
      rx={barRadius}
      ry={barRadius}
      onPress={onPress}
    />
  );
};


const SleepChart: FC<SleepChartProps> = ({ sleepDataLast7Days }) => {
  // <-- CHANGED: Adjusted state type
  const [processedData, setProcessedData] = useState<ProcessedSleepRecord[]>([]);
  const [maxSleepHours, setMaxSleepHours] = useState<number>(1);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // This is now just a mapping helper, not the source of order
  const dayAbbreviations: DayOfWeek[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const chartHeight = 130;
  const barWidth = 30;
  const barMargin = 10;
  const totalChartWidth = (barWidth + barMargin) * 7 - barMargin;

  const handleBarPress = (dayData: ProcessedSleepRecord, xPosition: number, yPosition: number, barHeight: number) => {
    const tooltipTop = yPosition - 60;

    setTooltip({
      visible: true,
      x: xPosition - 7.5 , // Center tooltip relative to the bar
      y: tooltipTop,
      day: dayData.day,
      hours: dayData.hours,
      date: dayData.date,
    })
  }

  const handleOutsidePress = () => {
    setTooltip(null);
  }

  // --- MAJOR CHANGE IN LOGIC ---
  useEffect(() => {
    // 1. Generate the last 7 days from today
    const last7DaysMeta: { dateString: string; dayName: DayOfWeek }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // Format date to 'YYYY-MM-DD' for reliable matching
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const dayName = dayAbbreviations[date.getDay()];
      last7DaysMeta.push({ dateString, dayName });
    }

    // 2. Process the incoming sleep data against our generated 7 days
    let maxHours = 0;
    const currentWeekData: ProcessedSleepRecord[] = last7DaysMeta.map(meta => {
      // Match by date string, not by day name
      const foundDay = sleepDataLast7Days?.find(
        (d): d is SleepRecord => d !== null && d !== undefined && d.date === meta.dateString
      );

      const hours = foundDay ? foundDay.hours : 0;
      if (hours > maxHours) {
        maxHours = hours;
      }
      // Use the dynamically generated dayName for the label
      return { day: meta.dayName, hours, date: meta.dateString };
    });

    setMaxSleepHours(maxHours > 0 ? maxHours : 1);
    setProcessedData(currentWeekData);

  }, [sleepDataLast7Days]); // Dependency remains the same

  if (!processedData.length) {
    return <Text style={styles.loadingText}>Loading sleep data...</Text>;
  }

  // --- RENDER LOGIC (Mostly Unchanged) ---
  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
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
              {[1, 2, 3].map((n) => {
                  const yPositionGrid = (chartHeight * 1 / 4) * n;
                  return (
                  <Line
                      key={`grid-line-${n}`}
                      x1="0"
                      y1={chartHeight - yPositionGrid}
                      x2={totalChartWidth}
                      y2={chartHeight - yPositionGrid}
                      stroke='#CAD9F333'
                      strokeWidth="1"
                  />
                  );
              })}

              {processedData.map((dayData, index) => {
                  const barScaleFactor = maxSleepHours > 0 ? dayData.hours / maxSleepHours : 0;
                  const barHeight = dayData.hours > 0 ? barScaleFactor * chartHeight * 0.9 : 0;
                  const xPosition = index * (barWidth + barMargin);
                  const yPosition = chartHeight - barHeight;

                  if (dayData.hours === 0 || barHeight <= 0) {
                    return (
                      <Rect
                        key={`${dayData.date}-empty`} // Use date for key
                        x={xPosition + (barWidth / 2) - 1}
                        y={chartHeight - 2}
                        width={2}
                        height={2}
                        fill="#555F7C"
                        onPress={() => handleBarPress(dayData, xPosition, chartHeight - 2, 2)}
                      />
                    );
                  }
                  return (
                    <RoundedBar
                      key={dayData.date} // Use date for key
                      x={xPosition}
                      y={yPosition - 3}
                      width={barWidth}
                      height={barHeight}
                      color="#4767C926"
                      onPress={() => handleBarPress(dayData, xPosition, yPosition - 3, barHeight)}
                    />
                  );
              })}
          </Svg>
        </View>
        <View style={styles.labelsContainer}>
          {processedData.map((dayData) => (
            // <-- CHANGED: Keyed by date for stability
            <Text key={`${dayData.date}-label`} style={styles.label}>
              {dayData.day}
            </Text>
          ))}
        </View>
        {tooltip?.visible && (
          <View
            style={[
              styles.tooltip,
              {
                left: tooltip.x,
                top: tooltip.y,
                // transform: [{ translateX: 50 }], 
              },
            ]}
          >
            <Text style={styles.tooltipText}>
              {`${Math.floor(tooltip.hours)}h ${Math.round((tooltip.hours % 1) * 60)}m`}
            </Text>
            {tooltip.date && <Text style={styles.tooltipDate}>{tooltip.date}</Text>}
            <View style={styles.tooltipArrow} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

// --- STYLES (Unchanged, but included for completeness) ---
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: (30 + 10) * 7,
    position: 'relative',
  },
  chartArea: {
    height: 130,
    marginBottom: 10,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    color: '#A0A8C4',
    fontSize: 12,
    textAlign: 'center',
    width: 30,
    marginHorizontal: 5,
  },
  loadingText: {
    color: '#A0A8C4',
    padding: 20,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipText: {
    color: '#1C2031',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tooltipDate: {
    color: '#555F7C',
    fontSize: 10,
    marginTop: 2,
  },
  tooltipArrow: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
});


export default SleepChart;