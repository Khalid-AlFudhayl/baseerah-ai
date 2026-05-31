const axios = require('axios')

const expoPushTokens = []

const addPushToken = (token) => {

  if (!token) return

  const exists =
    expoPushTokens.includes(token)

  if (!exists) {
    expoPushTokens.push(token)
  }

  console.log('Registered Push Tokens:', expoPushTokens.length)
}

const sendPushNotification = async ({
  title,
  body,
}) => {

  try {

    if (!expoPushTokens.length) return

    const messages = expoPushTokens.map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
    }))

    await axios.post(
      'https://exp.host/--/api/v2/push/send',
      messages,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('Push notification sent')

  } catch (error) {

    console.log(
      'Push notification error:',
      error.message
    )

  }

}

module.exports = {
  addPushToken,
  sendPushNotification,
}