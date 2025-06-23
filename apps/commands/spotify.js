const axios = require('axios');

const meta = {
  name: "spotify",
  version: "0.0.1",
  aliases: [],
  description: "Play a Spotify track",
  author: "ShawnDesu",
  prefix: "both",
  category: "music",
  type: "anyone",
  cooldown: 5,
  guide: "[song name]"
};

async function onStart({ bot, args, message, msg, usages }) {
  try {
    const songName = args.join(' ').trim();
    if (!songName) {
      return usages();
    }

    await bot.sendChatAction(message.chatId, 'upload_audio');

    const apiUrl = `https://api.nekorinn.my.id/downloader/spotifyplay?q=${encodeURIComponent(songName)}`;
    const response = await axios.get(apiUrl, { timeout: 10000 });

    if (!response.data.status || !response.data.result || !response.data.result.metadata || !response.data.result.downloadUrl) {
      return message.reply('Failed to retrieve track data.');
    }

    const metadata = response.data.result.metadata;
    const downloadUrl = response.data.result.downloadUrl;

    const caption = `**${metadata.title}** by ${metadata.artist} (${metadata.duration})\n[Listen on Spotify](${metadata.url})`;

    await message.audio(downloadUrl, { caption, parse_mode: 'Markdown' });
  } catch (error) {
    console.error(`[ ${meta.name} ] »`, error);
    return message.reply(`[ ${meta.name} ] » An error occurred while processing your request.`);
  }
}

module.exports = { meta, onStart };