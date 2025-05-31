import twilio from "twilio"

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export { client as twilioClient }

// SMS templates
export const smsTemplates = {
  welcome: (name) =>
    `🎉 Welcome to QLine, ${name || "there"}! You can now join queues instantly and get real-time updates. Start exploring: ${process.env.NEXT_PUBLIC_APP_URL || "https://qline.app"}/queues`,

  queueCreated: (queueName, queueId) =>
    `✅ Queue "${queueName}" created successfully! Your queue is now live and accepting visitors. Manage it here: ${process.env.NEXT_PUBLIC_APP_URL || "https://qline.app"}/admin/queues/${queueId}`,

  queueJoined: (userName, queueName, position, waitTime) =>
    `🎯 Hi ${userName}! You're #${position} in line for "${queueName}". Estimated wait: ${waitTime}. You'll get updates as the queue moves. Track: ${process.env.NEXT_PUBLIC_APP_URL || "https://qline.app"}/my-queue`,

  yourTurn: (userName, queueName, queueLocation) =>
    `🚨 IT'S YOUR TURN! Hi ${userName}, you're now being served at "${queueName}" (${queueLocation}). Please proceed immediately! 🏃‍♂️`,

  queueUpdate: (userName, queueName, newPosition, waitTime) =>
    `📊 Queue update: Hi ${userName}, you're now #${newPosition} in line for "${queueName}". New wait time: ${waitTime}. ${newPosition <= 3 ? "🔔 Almost your turn!" : "Hang tight!"}`,

  positionAlert: (userName, queueName, position) =>
    `⚡ Alert: Hi ${userName}, you're now #${position} for "${queueName}". ${position === 1 ? "You're NEXT! 🎯" : position <= 3 ? "Get ready, almost your turn! 🔔" : "Moving up! 📈"}`,
}

export async function sendSMS(to, message) {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    })
    return { success: true, messageId: result.sid }
  } catch (error) {
    console.error("SMS sending failed:", error)
    return { success: false, error: error.message }
  }
}
