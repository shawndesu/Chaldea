const axios = require("axios");

const meta = {
  name: "grok",
  version: "1.0.0",
  aliases: [],
  description: "Ask Grok AI anything",
  author: "@nekorinnn",
  prefix: "both",
  category: "ai",
  type: "anyone",
  cooldown: 5,
  guide: "[your question]"
};

async function onStart({ bot, args, message, msg, usages }) {
  try {
    const question = args.join(" ");
    if (!question) {
      return usages();
    }

    const response = await axios.get(
      `${global.api.neko}/ai/grok-3?text=${encodeURIComponent(question)}`
    );

    if (response.data && response.data.result) {
      // Replace any **word** with *word* for Telegram Markdown bold
      const formatted = response.data.result.replace(
        /\*\*(.+?)\*\*/g,
        (_, content) => `*${content}*`
      );
      return message.reply(formatted, { parse_mode: "Markdown" });
    } else {
      return message.reply(
        "Grok AI couldn't generate a response. Please try again later."
      );
    }
  } catch (error) {
    console.error(`[ ${meta.name} ] »`, error);
    return message.reply(
      `[ ${meta.name} ] » An error occurred while connecting to Grok AI.`
    );
  }
}

module.exports = { meta, onStart };
