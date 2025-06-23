const axios = require('axios');

const meta = {
  name: "spotify",
  version: "0.0.1",
  aliases: [],
  description: "Play a 30-second preview of a Spotify track",
  author: "ShawnDesu",
  prefix: "both",
  category: "music",
  type: "anyone",
  cooldown: 5,
  guide: "[search query]"
};

async function onStart({ bot, args, message, msg, usages }) {
  try {
    const query = args.join(" ");
    if (!query) {
      return usages();
    }

    // Search for tracks
    const searchResponse = await axios.get(`${global.api.neko}/search/spotify?q=${encodeURIComponent(query)}`);
    const tracks = searchResponse.data.result;
    if (!tracks || tracks.length === 0) {
      return message.reply("No tracks found for your query.");
    }

    const firstTrack = tracks[0];
    const spotifyUrl = firstTrack.url;

    // Get download URL using the downloader API
    const downloadResponse = await axios.get(`${global.api.neko}/downloader/spotify?url=${encodeURIComponent(spotifyUrl)}`);
    const downloadData = downloadResponse.data.result;
    if (!downloadData || !downloadData.downloadUrl) {
      return message.reply("Failed to get the download URL.");
    }

    const downloadUrl = downloadData.downloadUrl;
    const caption = `Title: ${downloadData.title}\nArtist: ${downloadData.artist}\nDuration: ${downloadData.duration}\nListen on Spotify: ${downloadData.link}`;

    // Send audio
    return message.audio(downloadUrl, { caption });
  } catch (error) {
    console.error(`[ ${meta.name} ] »`, error);
    return message.reply(`[ ${meta.name} ] » An error occurred while processing your request.`);
  }
}

module.exports = { meta, onStart };