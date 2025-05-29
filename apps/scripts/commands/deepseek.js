const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const meta = {
  name: "deepseek",
  description: "Ask Deepseek AI anything",
  category: "ai",
  type: "anyone",
  cooldown: 5,
  guide: "[your question]"
};

async function onStart({ message, args, usages }) {
  try {
    const question = args.join(" ");
    if (!question) return usages();

    const utoken = 'd4f1d8a9b69729c0b4d4e5d0e9e11bb345e9116fb440c7cb0983ec23da0a7927';
    const cookies = 'session=g54oXfajNw4BrpGVLRIeqfou9vW5iauYCZeIH6jjTMc; PHPSESSID=b63ec5f0df2f0418778b302ca0a0c499';
    const conversation_id = uuidv4();

    const headers = {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.5',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'cookie': cookies,
      'origin': 'https://minitoolai.com',
      'priority': 'u=1, i',
      'referer': 'https://minitoolai.com/deepseek/',
      'sec-ch-ua': '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      'x-requested-with': 'XMLHttpRequest'
    };

    // First POST to deepseek_stream.php
    await axios.post('https://minitoolai.com/deepseek/deepseek_stream.php', 
      `utoken=${encodeURIComponent(utoken)}&message=${encodeURIComponent(question)}&umes1a=&bres1a=&umes2a=&bres2a=`, 
      { headers }
    );

    // GET stream response from deepseek_stream.php
    const streamResponse = await axios.get('https://minitoolai.com/deepseek/deepseek_stream.php', {
      headers: { ...headers, 'accept': 'text/event-stream', 'cache-control': 'no-cache' },
      responseType: 'text'
    });

    let responseText = '';
    for (const event of streamResponse.data.split('\n\n')) {
      if (event.startsWith('data: ')) {
        try {
          const jsonData = JSON.parse(event.replace('data: ', ''));
          if (jsonData.message) responseText += jsonData.message;
        } catch (e) {}
      }
    }

    // Format response for Telegram
    const formatted = responseText
      .replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\*\*(.+?)\*\*/g, (_, content) => `*${content}*`);

    // Update chat title
    await axios.post('https://minitoolai.com/deepseek/update_chat_title.php', 
      `chat_title=${encodeURIComponent(question)}&conversation_id=${encodeURIComponent(conversation_id)}&utoken=${encodeURIComponent(utoken)}`, 
      { headers }
    );

    // Save chat history
    await axios.post('https://minitoolai.com/deepseek/save_chathistory.php', 
      `usermessage=${encodeURIComponent(question)}&chatbotmessage=${encodeURIComponent(formatted)}&conversation_id=${encodeURIComponent(conversation_id)}&utoken=${encodeURIComponent(utoken)}`, 
      { headers }
    );

    return message.reply(formatted || "No response from Deepseek AI.", { parse_mode: "Markdown" });
  } catch (error) {
    return message.reply("Error connecting to Deepseek AI.");
  }
}

module.exports = { meta, onStart };