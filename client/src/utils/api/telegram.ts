import { Bot } from "grammy";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID as string;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  throw new Error("Missing Telegram environment variables");
}

export const bot = new Bot(TELEGRAM_BOT_TOKEN);

function escapeHTML(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactMessage(data: {
  name: string;
  surname?: string;
  email: string;
  message: string;
  number?: string;
  additionalInfo?: Record<string, string>;
}) {
  const { name, surname, email, message, number, additionalInfo = {} } = data;

  const text = `
🔔 <b>Yeni Müraciət Formu</b>

👤 <b>Məlumatlar:</b>
• <b>Ad:</b> ${escapeHTML(name)}
${surname ? `• <b>Soyad:</b> ${escapeHTML(surname)}` : ""}
• <b>E-poçt:</b> ${escapeHTML(email)}
${number ? `• <b>Telefon:</b> ${escapeHTML(number)}` : ""}

💬 <b>Mesaj:</b>
${escapeHTML(message)}

${
  Object.keys(additionalInfo).length > 0
    ? `\nℹ️ <b>Əlavə Məlumat:</b>\n${Object.entries(additionalInfo)
        .map(
          ([key, value]) => `• <b>${escapeHTML(key)}:</b> ${escapeHTML(value)}`
        )
        .join("\n")}`
    : ""
}

📅 <i>Göndərilmə tarixi: ${new Date().toLocaleString("az-AZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}</i>

🌐 <code>jetschool.az</code>`;

  try {
    const result = await bot.api.sendMessage(TELEGRAM_CHAT_ID, text, {
      parse_mode: "HTML",
      disable_notification: false,
    });
    return { success: true, messageId: result.message_id };
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    throw new Error("Telegram mesajı göndərilə bilmədi");
  }
}
