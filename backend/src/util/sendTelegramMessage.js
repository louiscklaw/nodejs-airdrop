const TelegramBot = require('node-telegram-bot-api');

let TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
let HELLOWORLD_GROUP_CHATID = '-986776285'
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

function sendTelegramMessage(){
  console.log('sendTelegramMessage')
  bot.sendMessage(HELLOWORLD_GROUP_CHATID, `Hello from ChatGPT!`)
}

function sendHelloworldGroupMessage(message){
  try {
    bot.sendMessage(HELLOWORLD_GROUP_CHATID,message||'message is empty')
  } catch (error) {
    console.log(error)
  }
}

module.exports={sendTelegramMessage, sendHelloworldGroupMessage}
