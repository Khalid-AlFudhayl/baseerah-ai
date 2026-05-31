import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device')
      return null
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync()

    let finalStatus = existingStatus

    if (existingStatus !== 'granted') {
      const { status } =
        await Notifications.requestPermissionsAsync()

      finalStatus = status
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted')
      return null
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      })
    }

    console.log('Notifications permission granted')

    return null
  } catch (error) {
    console.log('Push notification setup skipped:', error)
    return null
  }
}