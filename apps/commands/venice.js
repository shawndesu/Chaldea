const axios = require('axios');

const meta = {
  name: "venice",
  version: "0.0.1",
  aliases: [],
  description: "Ask Venice AI anything",
  author: "ShawnDesu",
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
      `${global.api.neko}/ai/veniceai?text=${encodeURIComponent(question)}`
    );

    if (response.data && response.data.status && response.data.result) {
      const formatted = response.data.result.replace(
        /\*\*(.+?)\*\*/g,
        (_, content) => `*${content}*`
      );
      return message.reply(formatted, { parse_mode: "Markdown" });
    } else {
      return message.reply(
        "Venice AI couldn't generate a response. Please try again later."
      );
    }
  } catch (error) {
    console.error(`[ ${meta.name} ] »`, error);
    return message.reply(
      `[ ${meta.name} ] » An error occurred while connecting to Venice AI.`
    );
  }
}

module.exports = { meta, onStart };