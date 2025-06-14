import Chevron from '@/assets/icons/Chevron';
import { Colors } from '@/constants/Colors';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Line, Rect, Svg } from 'react-native-svg';
import FText from './FText';

// --- Type Definitions ---
interface SleepRecord {
  // day property is now optional, as we derive it from the date.
  day?: DayOfWeek;
  hours: number;
  // The date is the mandatory key for matching data.
  date: string; // Expects 'YYYY-MM-DD' format
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

// Internal state holds the generated day name
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

interface PaginatedSleepChartProps {
  /**
   * Array of all available sleep records.
   * The component will filter and display data for the selected week.
   */
  sleepData?: (SleepRecord | null | undefined)[];
}

// --- Helper Component for Bar (Unchanged) ---
const RoundedBar: FC<RoundedBarProps> = ({ width, height, x, y, color, onPress }) => {
  if (height <= 0) return null;
  const barRadius = Math.min(width / 2); // Added a max radius for aesthetics

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


const PaginatedSleepChart: FC<PaginatedSleepChartProps> = ({ sleepData }) => {
  // --- STATE ---
  const [endDate, setEndDate] = useState(new Date());
  const [processedData, setProcessedData] = useState<ProcessedSleepRecord[]>([]);
  const [maxSleepHours, setMaxSleepHours] = useState<number>(1);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // --- CONSTANTS ---
  const dayAbbreviations: DayOfWeek[] = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const chartHeight = 130;
  const barWidth = 30;
  const barMargin = 10;
  const totalChartWidth = (barWidth + barMargin) * 7 - barMargin;
  // --- FIX: This constant estimates the vertical offset caused by the navigation header ---
  const NAVIGATION_HEADER_OFFSET = 55; // Calculated from navButton height (35) + navigationContainer marginBottom (20)

  // --- HANDLERS & HELPERS ---

  const handlePreviousWeek = () => {
    const newEndDate = new Date(endDate);
    newEndDate.setDate(newEndDate.getDate() - 7);
    setEndDate(newEndDate);
    setTooltip(null);
  };

  const isNextWeekDisabled = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      return end >= today;
  };

  const handleNextWeek = () => {
    if (isNextWeekDisabled()) return;
    const newEndDate = new Date(endDate);
    newEndDate.setDate(newEndDate.getDate() + 7);
    if (newEndDate > new Date()) {
      setEndDate(new Date());
    } else {
      setEndDate(newEndDate);
    }
    setTooltip(null);
  };

  const formatDateRange = () => {
    const end = endDate;
    const start = new Date(endDate);
    start.setDate(start.getDate() - 6);
    const formatDate = (d: Date) => {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      return `${day}/${month}`;
    }
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  const handleBarPress = (dayData: ProcessedSleepRecord, xPosition: number, yPosition: number) => {
    // --- FIX: Adjust tooltip's vertical position to account for the navigation header ---
    // The tooltip's 'top' is relative to the main container. We add the header offset to the bar's
    // yPosition to get the bar's absolute top, then subtract 60 to place the tooltip above the bar.
    const tooltipTop = yPosition + NAVIGATION_HEADER_OFFSET - 60;

    setTooltip({
      visible: true,
      x: xPosition + 12.5, // Center tooltip relative to the bar
      y: tooltipTop,
      day: dayData.day,
      hours: dayData.hours,
      date: Intl.DateTimeFormat('pt-BR').format(new Date(dayData.date)),
    });
  };

  const handleOutsidePress = () => {
    setTooltip(null);
  };

  // --- DATA PROCESSING EFFECT ---
  useEffect(() => {
    const weekMeta: { dateString: string; dayName: DayOfWeek }[] = [];
    const weekEndDate = new Date(endDate);
    for (let i = 6; i >= 0; i--) {
      const date = new Date(weekEndDate);
      date.setDate(weekEndDate.getDate() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      const dayName = dayAbbreviations[date.getDay()];
      weekMeta.push({ dateString, dayName });
    }

    let maxHours = 0;
    const currentWeekData: ProcessedSleepRecord[] = weekMeta.map(meta => {
      const foundDay = sleepData?.find(
        (d): d is SleepRecord => d !== null && d !== undefined && d.date === meta.dateString
      );
      const hours = foundDay ? foundDay.hours : 0;
      if (hours > maxHours) {
        maxHours = hours;
      }
      return { day: meta.dayName, hours, date: meta.dateString };
    });

    setMaxSleepHours(maxHours > 0 ? maxHours : 1);
    setProcessedData(currentWeekData);
  }, [sleepData, endDate]);

  // --- RENDER ---
  if (!processedData.length) {
    return <Text style={styles.loadingText}>Loading sleep data...</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        {/* --- Navigation Header --- */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity onPress={handlePreviousWeek} style={styles.navButton}>
            <Chevron />
          </TouchableOpacity>
          <FText style={styles.dateRangeText}>{formatDateRange()}</FText>
          <TouchableOpacity onPress={handleNextWeek} disabled={isNextWeekDisabled()} style={styles.navButton}>
            <Chevron direction='right' style={[isNextWeekDisabled() && styles.navArrowDisabled]}/>
          </TouchableOpacity>
        </View>

        {/* --- Chart Area --- */}
        <View style={styles.chartArea}>
          <Svg height={chartHeight} width={totalChartWidth}>
            {/* Base and Grid Lines */}
            <Line x1="0" y1={chartHeight} x2={totalChartWidth} y2={chartHeight} stroke={Colors.Astronaut[200]} strokeWidth="1"/>
            {[1, 2, 3].map((n) => {
              const yPositionGrid = (chartHeight / 4) * n;
              return <Line key={`grid-${n}`} x1="0" y1={chartHeight - yPositionGrid} x2={totalChartWidth} y2={chartHeight - yPositionGrid} stroke='#CAD9F333' strokeWidth="1"/>;
            })}

            {/* Data Bars */}
            {processedData.map((dayData, index) => {
              const barScaleFactor = maxSleepHours > 0 ? dayData.hours / maxSleepHours : 0;
              const barHeight = dayData.hours > 0 ? barScaleFactor * chartHeight * 0.9 : 0;
              const xPosition = index * (barWidth + barMargin);
              const yPosition = chartHeight - barHeight;

              if (dayData.hours === 0 || barHeight <= 0) {
                return (
                  <Rect key={`${dayData.date}-empty`} x={xPosition + (barWidth / 2) - 1} y={chartHeight - 2} width={2} height={2} fill="#555F7C" onPress={() => handleBarPress(dayData, xPosition, chartHeight - 2)}/>
                );
              }

              return (
                <RoundedBar key={dayData.date} x={xPosition} y={yPosition - 3} width={barWidth} height={barHeight} color="#4767C926" onPress={() => handleBarPress(dayData, xPosition, yPosition - 3)}/>
              );
            })}
          </Svg>
        </View>

        {/* --- Day Labels --- */}
        <View style={styles.labelsContainer}>
          {processedData.map((dayData) => (
            <Text key={`${dayData.date}-label`} style={styles.label}>{dayData.day}</Text>
          ))}
        </View>

        {/* --- Tooltip --- */}
        {tooltip?.visible && (
          <View style={[styles.tooltip, { left: tooltip.x, top: tooltip.y }]}>
            <Text style={styles.tooltipText}>{`${Math.floor(tooltip.hours)}h ${Math.round((tooltip.hours % 1) * 60)}m`}</Text>
            {tooltip.date && <Text style={styles.tooltipDate}>{tooltip.date}</Text>}
            <View style={styles.tooltipArrow} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignItems: 'center',
    minWidth: (30 + 10) * 7,
    position: 'relative',
    padding: 20,
    borderRadius: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  navButton: {
    height: 35,
    width: 40,
    borderRadius: 30,
    backgroundColor: Colors.Card.Background,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  navArrow: {
    color: '#CAD9F3',
  },
  navArrowDisabled: {
    opacity: 0.5
  },
  dateRangeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
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

export default PaginatedSleepChart;
