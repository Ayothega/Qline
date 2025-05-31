import { resend, emailTemplates } from "./resend"
import { sendSMS, smsTemplates } from "./twilio"

export class NotificationService {
  static async sendWelcomeNotifications(user) {
    const notifications = []

    // Send welcome email
    if (user.email) {
      try {
        const emailResult = await resend.emails.send({
          from: "QLine <noreply@qline.app>",
          to: [user.email],
          ...emailTemplates.welcome(user.name),
        })
        notifications.push({ type: "email", success: true, id: emailResult.id })
      } catch (error) {
        notifications.push({ type: "email", success: false, error: error.message })
      }
    }

    // Send welcome SMS
    if (user.phone) {
      const smsResult = await sendSMS(user.phone, smsTemplates.welcome(user.name))
      notifications.push({ type: "sms", ...smsResult })
    }

    return notifications
  }

  static async sendQueueCreatedNotifications(queue, owner) {
    const notifications = []

    // Send email confirmation
    if (owner.email) {
      try {
        const emailResult = await resend.emails.send({
          from: "QLine <noreply@qline.app>",
          to: [owner.email],
          ...emailTemplates.queueCreated(queue.name, queue.id, owner.name),
        })
        notifications.push({ type: "email", success: true, id: emailResult.id })
      } catch (error) {
        notifications.push({ type: "email", success: false, error: error.message })
      }
    }

    // Send SMS confirmation
    if (owner.phone) {
      const smsResult = await sendSMS(owner.phone, smsTemplates.queueCreated(queue.name, queue.id))
      notifications.push({ type: "sms", ...smsResult })
    }

    return notifications
  }

  static async sendQueueJoinedNotifications(queueEntry, queue, userData) {
    const notifications = []
    const userName = userData.name || "there"
    const userEmail = userData.email
    const userPhone = userData.phone
    const waitTime = `${queueEntry.position * 2} min`

    // Send email confirmation
    if (userEmail) {
      try {
        const emailResult = await resend.emails.send({
          from: "QLine <noreply@qline.app>",
          to: [userEmail],
          ...emailTemplates.queueJoined(userName, queue.name, queueEntry.position, waitTime, queue.location),
        })
        notifications.push({ type: "email", success: true, id: emailResult.id })
      } catch (error) {
        notifications.push({ type: "email", success: false, error: error.message })
      }
    }

    // Send SMS confirmation
    if (userPhone) {
      const smsResult = await sendSMS(
        userPhone,
        smsTemplates.queueJoined(userName, queue.name, queueEntry.position, waitTime),
      )
      notifications.push({ type: "sms", ...smsResult })
    }

    return notifications
  }

  static async sendYourTurnNotifications(queueEntry, queue, userData) {
    const notifications = []
    const userName = userData.name || "there"
    const userEmail = userData.email
    const userPhone = userData.phone

    // Send urgent email
    if (userEmail) {
      try {
        const emailResult = await resend.emails.send({
          from: "QLine <urgent@qline.app>",
          to: [userEmail],
          ...emailTemplates.yourTurn(userName, queue.name, queue.location, queueEntry.position),
        })
        notifications.push({ type: "email", success: true, id: emailResult.id })
      } catch (error) {
        notifications.push({ type: "email", success: false, error: error.message })
      }
    }

    // Send urgent SMS
    if (userPhone) {
      const smsResult = await sendSMS(userPhone, smsTemplates.yourTurn(userName, queue.name, queue.location))
      notifications.push({ type: "sms", ...smsResult })
    }

    return notifications
  }

  static async sendQueueUpdateNotifications(queueEntry, queue, userData, updateType = "Position Updated") {
    const notifications = []
    const userName = userData.name || "there"
    const userEmail = userData.email
    const userPhone = userData.phone
    const waitTime = `${queueEntry.position * 2} min`

    // Send email update
    if (userEmail) {
      try {
        const emailResult = await resend.emails.send({
          from: "QLine <updates@qline.app>",
          to: [userEmail],
          ...emailTemplates.queueUpdate(userName, queue.name, queueEntry.position, waitTime, updateType),
        })
        notifications.push({ type: "email", success: true, id: emailResult.id })
      } catch (error) {
        notifications.push({ type: "email", success: false, error: error.message })
      }
    }

    // Send SMS update (only for important updates or when close to turn)
    if (userPhone && (queueEntry.position <= 5 || updateType === "Position Updated")) {
      const smsResult = await sendSMS(
        userPhone,
        smsTemplates.queueUpdate(userName, queue.name, queueEntry.position, waitTime),
      )
      notifications.push({ type: "sms", ...smsResult })
    }

    return notifications
  }

  static async sendPositionAlertNotifications(queueEntry, queue, userData) {
    const notifications = []
    const userName = userData.name || "there"
    const userPhone = userData.phone

    // Send SMS alert for positions 1-3
    if (userPhone && queueEntry.position <= 3) {
      const smsResult = await sendSMS(userPhone, smsTemplates.positionAlert(userName, queue.name, queueEntry.position))
      notifications.push({ type: "sms", ...smsResult })
    }

    return notifications
  }
}

export default NotificationService
