import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export { resend }

// Email templates
export const emailTemplates = {
  welcome: (name) => ({
    subject: "Welcome to QLine - Smart Queue Management",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">Welcome to QLine!</h1>
          <p style="color: #6b7280; font-size: 18px;">Smart Queue Management Made Simple</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 15px 0;">Hello ${name || "there"}! 👋</h2>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">
            You've successfully joined QLine, the smartest way to manage queues and save time.
          </p>
        </div>

        <div style="background: #f9fafb; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #374151; margin-top: 0;">What you can do with QLine:</h3>
          <ul style="color: #6b7280; line-height: 1.6;">
            <li>🎯 <strong>Join queues instantly</strong> - No more waiting in physical lines</li>
            <li>📱 <strong>Real-time updates</strong> - Get notified when it's your turn</li>
            <li>📊 <strong>Create & manage queues</strong> - Perfect for businesses and events</li>
            <li>🤖 <strong>AI-powered insights</strong> - Smart wait time predictions</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://qline.app"}/queues" 
             style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Explore Queues
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
          <p>Need help? Contact us at support@qline.app</p>
          <p>© 2024 QLine. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  queueCreated: (queueName, queueId, ownerName) => ({
    subject: `Queue "${queueName}" Created Successfully`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">Queue Created! 🎉</h1>
        </div>
        
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 15px 0;">Congratulations ${ownerName}!</h2>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">
            Your queue "<strong>${queueName}</strong>" is now live and ready to accept visitors.
          </p>
        </div>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #166534; margin-top: 0;">Queue Details:</h3>
          <ul style="color: #166534; line-height: 1.6; margin: 0;">
            <li><strong>Queue Name:</strong> ${queueName}</li>
            <li><strong>Queue ID:</strong> ${queueId}</li>
            <li><strong>Status:</strong> Active and accepting new members</li>
          </ul>
        </div>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #374151; margin-top: 0;">Next Steps:</h3>
          <ul style="color: #6b7280; line-height: 1.6;">
            <li>📢 Share your queue link with customers</li>
            <li>📊 Monitor queue activity from your dashboard</li>
            <li>⚡ Use real-time updates to manage efficiently</li>
            <li>🤖 Get AI insights for optimization</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://qline.app"}/admin/queues/${queueId}" 
             style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-right: 10px;">
            Manage Queue
          </a>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://qline.app"}/queues/${queueId}" 
             style="background: #6b7280; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View Public Page
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
          <p>© 2024 QLine. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  queueJoined: (userName, queueName, position, waitTime, queueLocation) => ({
    subject: `You're in line! Position #${position} - ${queueName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">You're in the Queue! 🎯</h1>
        </div>
        
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 15px 0;">Welcome ${userName}!</h2>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">
            You've successfully joined the queue for <strong>${queueName}</strong>
          </p>
        </div>

        <div style="display: flex; justify-content: space-around; margin-bottom: 30px;">
          <div style="text-align: center; background: #fef3c7; padding: 20px; border-radius: 8px; flex: 1; margin: 0 5px;">
            <div style="font-size: 32px; font-weight: bold; color: #d97706; margin-bottom: 5px;">#${position}</div>
            <div style="color: #92400e; font-size: 14px;">Your Position</div>
          </div>
          <div style="text-align: center; background: #dbeafe; padding: 20px; border-radius: 8px; flex: 1; margin: 0 5px;">
            <div style="font-size: 24px; font-weight: bold; color: #1d4ed8; margin-bottom: 5px;">${waitTime}</div>
            <div style="color: #1e40af; font-size: 14px;">Est. Wait Time</div>
          </div>
        </div>

        <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #0c4a6e; margin-top: 0;">Queue Information:</h3>
          <ul style="color: #0c4a6e; line-height: 1.6; margin: 0;">
            <li><strong>Location:</strong> ${queueLocation}</li>
            <li><strong>Joined:</strong> ${new Date().toLocaleString()}</li>
            <li><strong>Status:</strong> Waiting in line</li>
          </ul>
        </div>

        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #065f46; margin-top: 0;">What happens next?</h3>
          <ul style="color: #065f46; line-height: 1.6; margin: 0;">
            <li>🔔 You'll receive real-time updates as the queue moves</li>
            <li>📱 Get notified when it's almost your turn</li>
            <li>⚡ Receive an alert when you're being served</li>
            <li>📊 Track your progress in real-time</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://qline.app"}/my-queue" 
             style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Track My Position
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
          <p>© 2024 QLine. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  yourTurn: (userName, queueName, queueLocation, position) => ({
    subject: `🔔 It's Your Turn! - ${queueName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #dc2626; margin: 0; font-size: 32px;">🚨 IT'S YOUR TURN! 🚨</h1>
        </div>
        
        <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px; animation: pulse 2s infinite;">
          <h2 style="margin: 0 0 15px 0; font-size: 28px;">Hello ${userName}!</h2>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">
            You're now being served at <strong>${queueName}</strong>
          </p>
          <div style="margin-top: 20px; font-size: 48px;">🎉</div>
        </div>

        <div style="background: #fef2f2; border: 2px solid #fca5a5; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #991b1b; margin-top: 0; text-align: center;">⏰ PLEASE PROCEED IMMEDIATELY</h3>
          <div style="text-align: center; margin: 20px 0;">
            <div style="background: #dc2626; color: white; padding: 15px; border-radius: 8px; display: inline-block;">
              <div style="font-size: 24px; font-weight: bold;">Position #${position}</div>
              <div style="font-size: 14px; opacity: 0.9;">Now Being Served</div>
            </div>
          </div>
          <p style="color: #991b1b; text-align: center; margin: 0; font-weight: bold;">
            📍 Location: ${queueLocation}
          </p>
        </div>

        <div style="background: #fffbeb; border: 1px solid #fed7aa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #92400e; margin-top: 0;">Important Reminders:</h3>
          <ul style="color: #92400e; line-height: 1.6; margin: 0;">
            <li>🏃‍♂️ Please proceed to the service location immediately</li>
            <li>📱 Have your confirmation details ready</li>
            <li>⏱️ Don't keep others waiting - you're up!</li>
            <li>❓ Ask staff if you need help finding the location</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://qline.app"}/my-queue" 
             style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 18px;">
            View My Status
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
          <p>© 2024 QLine. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  queueUpdate: (userName, queueName, newPosition, waitTime, updateType) => ({
    subject: `Queue Update - Position #${newPosition} - ${queueName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">Queue Update 📊</h1>
        </div>
        
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; border-radius: 12px; color: white; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 15px 0;">Hi ${userName}!</h2>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">
            Your position in <strong>${queueName}</strong> has been updated
          </p>
        </div>

        <div style="display: flex; justify-content: space-around; margin-bottom: 30px;">
          <div style="text-align: center; background: #f3f4f6; padding: 20px; border-radius: 8px; flex: 1; margin: 0 5px;">
            <div style="font-size: 32px; font-weight: bold; color: ${newPosition <= 3 ? "#dc2626" : "#7c3aed"}; margin-bottom: 5px;">#${newPosition}</div>
            <div style="color: #6b7280; font-size: 14px;">New Position</div>
          </div>
          <div style="text-align: center; background: #f3f4f6; padding: 20px; border-radius: 8px; flex: 1; margin: 0 5px;">
            <div style="font-size: 24px; font-weight: bold; color: #059669; margin-bottom: 5px;">${waitTime}</div>
            <div style="color: #6b7280; font-size: 14px;">Est. Wait Time</div>
          </div>
        </div>

        ${
          newPosition <= 3
            ? `
        <div style="background: #fef2f2; border: 1px solid #fca5a5; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #991b1b; margin-top: 0;">🔔 Almost Your Turn!</h3>
          <p style="color: #991b1b; margin: 0;">
            You're in the top 3! Please be ready as you'll be called soon.
          </p>
        </div>
        `
            : ""
        }

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #374151; margin-top: 0;">Update Details:</h3>
          <ul style="color: #6b7280; line-height: 1.6; margin: 0;">
            <li><strong>Update Type:</strong> ${updateType}</li>
            <li><strong>Current Position:</strong> #${newPosition}</li>
            <li><strong>Updated:</strong> ${new Date().toLocaleString()}</li>
            <li><strong>Status:</strong> Waiting in line</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://qline.app"}/my-queue" 
             style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View Live Updates
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 14px;">
          <p>© 2024 QLine. All rights reserved.</p>
        </div>
      </div>
    `,
  }),
}
