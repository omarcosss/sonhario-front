import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

// Tipo para o objeto de tempo para clareza
type TimeInput = {
  hour: number;
  minute: number;
};

/**
 * Agenda uma notificação diária para a hora de dormir.
 * Cancela qualquer notificação de dormir anterior antes de agendar uma nova.
 */
export const scheduleSleepNotification = async (time: TimeInput) => {
  const identifier = 'sleep-reminder';

  // --- Linha de Depuração ---
  console.log(`[Notification Service] A agendar notificação de dormir para as ${time.hour}:${time.minute} diariamente.`);

  // Cancela a notificação anterior com o mesmo identificador
  await Notifications.cancelScheduledNotificationAsync(identifier);

  // Agenda a nova notificação
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title: "Hora de dormir! 😴",
      body: 'Está na hora de começar a relaxar para uma boa noite de sono.',
      sound: true,
    },
    trigger: {
      // Para algumas versões da API, é necessário especificar o canal
      channelId: 'default', 
      hour: time.hour,
      minute: time.minute,
      repeats: true, // Garante que a notificação se repita todos os dias
    },
  });

  Alert.alert('Lembrete Salvo!', `Você será notificado para dormir às ${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}.`);
};

/**
 * Agenda uma notificação diária para a hora de acordar.
 * Cancela qualquer notificação de acordar anterior antes de agendar uma nova.
 */
export const scheduleWakeUpNotification = async (time: TimeInput) => {
  const identifier = 'wakeup-reminder';

  console.log(`[Notification Service] A agendar notificação de acordar para as ${time.hour}:${time.minute} diariamente.`);
  // Cancela a notificação anterior com o mesmo identificador
  await Notifications.cancelScheduledNotificationAsync(identifier);

  // Agenda a nova notificação
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title: "Bom dia! ☀️",
      body: 'Hora de acordar e registrar seu sono de ontem!',
      sound: true,
    },
    trigger: {
      // Para algumas versões da API, é necessário especificar o canal
      channelId: 'default', 
      hour: time.hour,
      minute: time.minute,
      repeats: true, // Garante que a notificação se repita todos os dias
    },
  });

  Alert.alert('Lembrete Salvo!', `Você será notificado para acordar às ${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}.`);
};


/**
 * Cancela TODAS as notificações agendadas pelo aplicativo.
 */
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  Alert.alert('Lembretes Cancelados', 'Todas as notificações de sono foram removidas.');
};

