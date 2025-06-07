import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function TabTwoScreen() {
  return (
    <LinearGradient colors={['rgba(0, 0, 0, 0.00)', 'rgba(50, 64, 123, 0.40)']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.gradient}>
      <ScrollView style={{ flex: 1, paddingTop: 20 }} bounces={false}>
        
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  gradient: {
          flex: 1,
          padding: 20,
          paddingTop: Platform.OS === 'ios' ? 50 : 20,
          backgroundColor: '#161616',
      },
});
