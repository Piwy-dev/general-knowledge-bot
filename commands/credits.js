const language = require('../language')

module.exports = {
    commands: ['credits'],
    callback: async (message, arguments, text) => {
        const {guild} = message
    
        message.channel.send(`${language(guild, "CREDITS")}`)
    },
  }
  