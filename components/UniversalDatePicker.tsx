// components/CrossPlatformDatePicker.tsx
import { Colors } from '@/constants/Colors';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as React from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';

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

export default function CrossPlatformDatePicker({
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

  const applyTime = (h: number, m: number) => {
    const next = new Date(value);
    next.setHours(h);
    next.setMinutes(m);
    next.setSeconds(0);
    next.setMilliseconds(0);
    onChange(next);
  };

  const applyDateOffsetDays = (daysOffset: number) => {
    const next = new Date(value);
    next.setDate(new Date().getDate() + daysOffset);
    next.setMonth(new Date().getMonth());
    next.setFullYear(new Date().getFullYear());
    onChange(next);
  };

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
            style={{ fontSize: 16, padding: 10, borderRadius: 8,borderWidth: 1, borderColor: Colors.Card.Stroke, backgroundColor: Colors.Card.Background, color: Colors.Astronaut[50] }}
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
        onPress={() => setOpen(true)}
        style={{ display: 'flex', justifyContent: 'center', padding: 10, borderRadius: 999, borderWidth: 1, borderColor: Colors.Card.Stroke, backgroundColor: Colors.Card.Background }}
      >
        <Text style={{color: Colors.Astronaut[50], textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>{displayValue}</Text>
      </Pressable>

      {open && (
        <Modal transparent animationType="slide" onRequestClose={() => setOpen(false)}>
          <Pressable style={{ flex: 1, backgroundColor: '#0006' }} onPress={() => setOpen(false)} />
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: Colors.dark.background, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 40, borderTopRightRadius: 40, borderWidth: 1, borderColor: Colors.Card.Stroke, borderBottomColor: Colors.dark.background  }}>
            {showSuggestions !== false && (
              <View style={{ flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'flex-end', marginTop: 12 }}>
                {mode === 'time' && timeSuggestions.map(s => (
                  <SuggestionChip key={s.label} onPress={() => applyTime(s.h, s.m)}>{s.label}</SuggestionChip>
                ))}
                {mode === 'date' && dateSuggestions.map(s => (
                  <SuggestionChip key={s.label} onPress={() => applyDateOffsetDays(s.offset)}>{s.label}</SuggestionChip>
                ))}
              </View>
            )}
            <DateTimePicker
              value={value}
              mode={mode}
              display={
                Platform.OS === 'ios'
                  ? mode === 'time'
                    ? 'spinner'
                    : 'inline'
                  : mode === 'time'
                  ? 'spinner'
                  : 'calendar'
              }
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onChange={(_e: DateTimePickerEvent, selected) => {
                if (selected) onChange(selected);
              }}
            />
            
          </View>
        </Modal>
      )}
    </View>
  );
}