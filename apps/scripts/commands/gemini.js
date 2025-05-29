const meta = {
  name: "gemini",
  version: "0.0.1",
  aliases: [],
  description: "Ask Gemini AI anything via minitoolai.com",
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

    const data = JSON.stringify({
      utoken: '95cd33125b21afb1621fde2fb877ed06cf0939369801170ab850dd3a4bc0bb59',
      message: question
    });

    const options = {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.5',
        'content-type': 'application/json',
        'cookie': 'PHPSESSID=080b545b46e5d5511a56dcac2bcc8719; session=g54oXfajNw4BrpGVLRIeqfou9vW5iauYCZeIH6jjTMc',
        'origin': 'https://minitoolai.com',
        'priority': 'u=1, i',
        'referer': 'https://minitoolai.com/Gemini-Pro/',
        'sec-ch-ua': '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
        'Content-Length': Buffer.byteLength(data)
      },
      body: data
    };

    const response = await fetch('https://minitoolai.com/test_python/', options);
    const responseData = await response.json();

    if (responseData && responseData.response) {
      // Replace any **word** with *word* for Telegram Markdown bold
      const formatted = responseData.response.replace(
        /\*\*(.+?)\*\*/g,
        (_, content) => `*${content}*`
      );
      return message.reply(formatted, { parse_mode: "Markdown" });
    } else {
      return message.reply(
        "Gemini AI couldn't generate a response. Please try again later."
      );
    }
  } catch (error) {
    console.error(`[ ${meta.name} ] »`, error);
    return message.reply(
      `[ ${meta.name} ] » An error occurred while connecting to Gemini AI.`
    );
  }
}

module.exports = { meta, onStart };