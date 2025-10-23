// components/CrossPlatformDatePicker.tsx
import { Colors } from '@/constants/Colors';
import DateTimePicker, { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MaskedView from "@react-native-masked-view/masked-view"; // for transparent fade-out
import * as Haptics from 'expo-haptics';
import { LinearGradient } from "expo-linear-gradient";
import * as React from 'react';
import { useCallback } from 'react';
import { Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { TimerPicker } from "react-native-timer-picker";

type Props = {
  value: Date;
  onChange: (d: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  locale?: string; // ex: 'pt-BR'
  label?: string;
  mode?: 'date' | 'time';
  showSuggestions?: boolean;
  suggestionKind?: 'goToBed' | 'wakeUp';
  entryMode?: 'planejar' | 'registrar'; // controla chips de data (Hoje/Ontem)
};

export default function UniversalDatePicker({
  value,
  onChange,
  minimumDate,
  maximumDate,
  locale = 'pt-BR',
  mode = 'date',
  label,
  showSuggestions,
  suggestionKind = 'goToBed',
  entryMode = 'planejar',
}: Props) {
  const [open, setOpen] = React.useState(false);
  const isAndroid = Platform.OS === 'android';

  const timePickerInitialValue = React.useMemo(
    () => ({
      hours: value.getHours(),
      minutes: value.getMinutes(),
      seconds: value.getSeconds(),
    }),
    [value],
  );

  const timePickerKey = React.useMemo(
    () => `timer-${value.getHours()}-${value.getMinutes()}-${value.getSeconds()}`,
    [value],
  );

  const applyTime = (h: number, m: number) => {
    const next = new Date(value);
    next.setHours(h);
    next.setMinutes(m);
    next.setSeconds(0);
    next.setMilliseconds(0);
    onChange(next);
  };

  const handleTimeDurationChange = useCallback(
    (duration: { hours?: number; minutes?: number; seconds?: number; days?: number }) => {
      const next = new Date(value);
      if (typeof duration.hours === 'number') {
        next.setHours(duration.hours);
      }
      if (typeof duration.minutes === 'number') {
        next.setMinutes(duration.minutes);
      }
      if (typeof duration.seconds === 'number') {
        next.setSeconds(duration.seconds);
      } else {
        next.setSeconds(0);
      }
      next.setMilliseconds(0);
      if (next.getTime() !== value.getTime()) {
        onChange(next);
      }
    },
    [onChange, value],
  );

  const handleDateChange = useCallback(
    (selected: Date) => {
      const next = new Date(selected);
      next.setHours(value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
      if (next.getTime() !== value.getTime()) {
        onChange(next);
      }
    },
    [onChange, value],
  );

  const applyDateOffsetDays = (daysOffset: number) => {
    const next = new Date(value);
    next.setDate(new Date().getDate() + daysOffset);
    next.setMonth(new Date().getMonth());
    next.setFullYear(new Date().getFullYear());
    onChange(next);
  };

  const pickerFeedback = useCallback(() => {
    try {
      Haptics.selectionAsync();

      // const context = audioContextRef.current;
      // const buffer = audioBufferRef.current;

      // if (!context || !buffer) {
      //     console.warn("Audio not initialized");
      //     return;
      // }

      // const playerNode = context.createBufferSource();
      // playerNode.buffer = buffer;
      // playerNode.connect(context.destination);
      // playerNode.start(context.currentTime);
    } catch (error) {
      console.warn("Picker feedback failed:", error);
    }
  }, []);

  const timeSuggestions: { label: string; h: number; m: number }[] = React.useMemo(() => {
    if (mode !== 'time') return [];
    if (suggestionKind === 'wakeUp') {
      return [
        { label: '06:00', h: 6, m: 0 },
        { label: '06:30', h: 6, m: 30 },
        { label: '07:00', h: 7, m: 0 },
        { label: '07:30', h: 7, m: 30 },
      ];
    }
    // default: goToBed
    return [
      { label: '22:00', h: 22, m: 0 },
      { label: '22:30', h: 22, m: 30 },
      { label: '23:00', h: 23, m: 0 },
      { label: '23:30', h: 23, m: 30 },
    ];
  }, [mode, suggestionKind]);

  const dateSuggestions: { label: string; offset: number }[] = React.useMemo(() => {
    if (mode !== 'date') return [];
    if (entryMode === 'registrar') return [{ label: 'Ontem', offset: -1 }];
    // default: planejar
    return [{ label: 'Hoje', offset: 0 }];
  }, [mode, entryMode]);

  const SuggestionChip: React.FC<{ onPress: () => void; active?: boolean; children: React.ReactNode }> = ({ onPress, active, children }) => (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: Colors.Card.Stroke,
        backgroundColor: Colors.Card.Background,
        marginRight: 8,
      }}
    >
      <Text style={{ color: Colors.Astronaut[50], fontSize: 16 }}>{children}</Text>
    </Pressable>
  );

  const suggestions =
    showSuggestions !== false
      ? mode === 'time' && timeSuggestions.length > 0
        ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            bounces
            style={{ alignSelf: 'stretch', marginTop: 12 }}
            contentContainerStyle={{ flexDirection: 'row', justifyContent: 'flex-end', display: 'flex' }}
          >
            {timeSuggestions.map(s => (
              <SuggestionChip key={s.label} onPress={() => applyTime(s.h, s.m)}>{s.label}</SuggestionChip>
            ))}
          </ScrollView>
        )
        : mode === 'date' && dateSuggestions.length > 0
          ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces
              style={{ alignSelf: 'stretch', marginTop: 12 }}
              contentContainerStyle={{ flexDirection: 'row', justifyContent: 'flex-end' }}
            >
              {dateSuggestions.map(s => (
                <SuggestionChip key={s.label} onPress={() => applyDateOffsetDays(s.offset)}>{s.label}</SuggestionChip>
              ))}
            </ScrollView>
          )
          : null
      : null;

  const handleOpen = React.useCallback(() => {
    if (isAndroid && mode === 'date') {
      DateTimePickerAndroid.open({
        value,
        mode: 'date',
        minimumDate,
        maximumDate,
        onChange: (event, selected) => {
          if (event.type === 'set' && selected) {
            handleDateChange(selected);
          }
        },
      });
      return;
    }
    setOpen(true);
  }, [handleDateChange, isAndroid, maximumDate, minimumDate, mode, value]);

  if (Platform.OS === 'web') {
    // Renderiza input nativo do browser
    const toYYYYMMDD = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const toHHMM = (d: Date) =>
      `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

    if (mode === 'time') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          {showSuggestions !== false && timeSuggestions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {timeSuggestions.map(s => (
                <button
                  key={s.label}
                  onClick={() => applyTime(s.h, s.m)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: `1px solid ${Colors.Card.Stroke}`,
                    background: Colors.Card.Background,
                    color: Colors.Astronaut[50],
                    marginRight: 8,
                    cursor: 'pointer'
                  }}
                >{s.label}</button>
              ))}
            </div>
          )}
          <input
            aria-label={label ?? 'Hora'}
            type="time"
            value={toHHMM(value)}
            min={minimumDate ? toHHMM(minimumDate) : undefined}
            max={maximumDate ? toHHMM(maximumDate) : undefined}
            onChange={(e) => {
              const [h, m] = e.currentTarget.value.split(':').map(Number);
              const next = new Date(value);
              next.setHours(h);
              next.setMinutes(m);
              onChange(next);
            }}
            style={{ fontSize: 16, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: Colors.Card.Stroke, backgroundColor: Colors.Card.Background, color: Colors.Astronaut[50] }}
          />
        </div>
      );
    } else {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          {showSuggestions !== false && dateSuggestions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {dateSuggestions.map(s => (
                <button
                  key={s.label}
                  onClick={() => applyDateOffsetDays(s.offset)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 999,
                    border: `1px solid ${Colors.Card.Stroke}`,
                    background: Colors.Card.Background,
                    color: Colors.Astronaut[50],
                    marginRight: 8,
                    cursor: 'pointer'
                  }}
                >{s.label}</button>
              ))}
            </div>
          )}
          <input
            aria-label={label ?? 'Data'}
            type="date"
            value={toYYYYMMDD(value)}
            min={minimumDate ? toYYYYMMDD(minimumDate) : undefined}
            max={maximumDate ? toYYYYMMDD(maximumDate) : undefined}
            onChange={(e) => {
              const [y, m, d] = e.currentTarget.value.split('-').map(Number);
              const next = new Date(value);
              next.setFullYear(y);
              next.setMonth(m - 1);
              next.setDate(d);
              onChange(next);
            }}
            style={{ fontSize: 16, padding: 10, borderRadius: 8, borderColor: Colors.Card.Stroke, backgroundColor: Colors.Card.Background, color: Colors.Astronaut[50] }}
          />
        </div>
      );
    }
  }

  let displayValue: string;
  if (mode === 'time') {
    displayValue = value.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  } else {
    displayValue = value.toLocaleDateString(locale);
  }
  return (
    <View style={{ gap: 8, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <Pressable
        onPress={handleOpen}
        style={{ display: 'flex', justifyContent: 'center', padding: 10, borderRadius: 999, borderWidth: 1, borderColor: Colors.Card.Stroke }}
      >
        <Text style={{ color: Colors.Astronaut[50], textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>{displayValue}</Text>
      </Pressable>

      {/* {isAndroid && suggestions} */}

      {open && (
        <Modal transparent animationType="slide" onRequestClose={() => setOpen(false)}>
          <Pressable style={{ flex: 1, backgroundColor: '#0006' }} onPress={() => setOpen(false)} />
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: Colors.dark.background, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 40, borderTopRightRadius: 40, borderWidth: 1, borderColor: Colors.Card.Stroke, borderBottomColor: Colors.dark.background }}>
            {suggestions}
            {mode === 'time' && (
              <TimerPicker
                key={timePickerKey}
                padWithNItems={1}
                hourLabel=":"
                minuteLabel=""
                hideSeconds
                initialValue={timePickerInitialValue}
                onDurationChange={handleTimeDurationChange}
                pickerFeedback={pickerFeedback}
                LinearGradient={LinearGradient}
                MaskedView={MaskedView}
                styles={{
                  theme: "dark",
                  backgroundColor: "transparent", // transparent fade-out
                  pickerItem: {
                    fontSize: 34,
                  },
                  pickerLabel: {
                    fontSize: 32,
                    marginTop: 0,
                  },
                  pickerContainer: {
                    marginRight: 6,
                  },
                  pickerItemContainer: {
                    width: 100
                  },
                  pickerLabelContainer: {
                    right: -20,
                    top: 0,
                    bottom: 6,
                    width: 40,
                    alignItems: "center",
                  },
                }}
              />
            )}
            {mode === 'date' && Platform.OS !== 'android' && (
              <DateTimePicker
                value={value}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                themeVariant="dark"
                textColor={Colors.Astronaut[50]}
                locale={locale}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={(_event: DateTimePickerEvent, selected) => {
                  if (selected) handleDateChange(selected);
                }}
              />
            )}
            <Button mode="contained" onPress={() => setOpen(false)} style={{ flex: 1, backgroundColor: Colors.Astronaut[900], alignSelf: "flex-end", marginRight: 12, marginBottom: 12 }} >
              Ok
            </Button>
          </View>
        </Modal>
      )}
    </View>
  );
}
