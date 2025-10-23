import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import {SchedulableTriggerInputTypes} from 'expo-notifications';

// Tipo para o objeto de tempo para clareza
type TimeInput = {
  hour: number;
  minute: number;
};

/**
 * Função final para agendar uma notificação DIÁRIA e verificar o agendamento.
 */
async function scheduleAndVerify(identifier: string, content: Notifications.NotificationContentInput, time: TimeInput) {
  
  console.log(`[Serviço de Notificação] A TENTAR agendar '${identifier}' para as ${time.hour}:${time.minute} diariamente.`);

  // Cancela qualquer notificação anterior com este ID
  await Notifications.cancelScheduledNotificationAsync(identifier);

  // 1. Agenda a notificação usando o gatilho de calendário, que é o correto para esta tarefa
  try {
    await Notifications.scheduleNotificationAsync({
      identifier,
      content,
      trigger: {
        hour: time.hour,
        minute: time.minute,
        repeats: false,
        channelId: 'default',
      },
    });

    console.log("[Serviço de Notificação] Comando de agendamento enviado com sucesso.");
    Alert.alert(
      'Lembrete Salvo!',
      `Será notificado diariamente às ${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}.`
    );

  } catch (error) {
    console.error("Erro ao agendar a notificação:", error);
    Alert.alert("Erro", "Não foi possível agendar o lembrete.");
    return;
  }
  
  // 2. VERIFICAÇÃO: Imediatamente após agendar, pede ao sistema operativo a lista de todas as notificações agendadas.
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log("--- VERIFICAÇÃO DE AGENDAMENTO NO SISTEMA ---");
    console.log("Notificações atualmente agendadas:", JSON.stringify(scheduledNotifications, null, 2));
    console.log("--- FIM DA VERIFICAÇÃO ---");
  } catch (error) {
    console.error("Erro ao obter as notificações agendadas:", error);
  }
}

// As suas funções agora chamam a nova função de agendamento e verificação
export const scheduleSleepNotification = async (time: TimeInput) => {
  await scheduleAndVerify(
    'sleep-reminder',
    {
      title: "Hora de dormir! 😴",
      body: 'Está na hora de começar a relaxar para uma boa noite de sono.',
      sound: true,
    },
    time
  );
};

export const scheduleWakeUpNotification = async (time: TimeInput) => {
  await scheduleAndVerify(
    'wakeup-reminder',
    {
      title: "Bom dia! ☀️",
      body: 'Hora de acordar e registar o seu sono de ontem!',
      sound: true,
    },
    time
  );
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  Alert.alert('Lembretes Cancelados', 'Todas as notificações de sono foram removidas.');
};

async function logNextTriggerDate() {
  try {
    const nextTriggerDate = await Notifications.getNextTriggerDateAsync({
      type: SchedulableTriggerInputTypes.CALENDAR,
      day: 19,
      month: 10,
      hour: 16,
      minute: 30,
    });
    console.log(nextTriggerDate === null ? 'No next trigger date' : new Date(nextTriggerDate));
  } catch (e) {
    console.warn(`Couldn't have calculated next trigger date: ${e}`);
  }
}
//fazer do 0 eu


// First, set the handler that will cause the notification
// to show the alert





    //testes basico
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });

// // Second, call scheduleNotificationAsync()
// Notifications.scheduleNotificationAsync({
//   content: {
//     title: 'Look at that notification',
//     body: "I'm so proud of myself! socorro nao aguento mais",
//   },
//   trigger:{
//     type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
//       seconds: 4,
//   }
  
// });
