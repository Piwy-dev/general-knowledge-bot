const language = require('../language')
const profile = require('../bdd/profile')

module.exports = {
    commands: ['adminxp'],
    expectedArgs: '<Member> <Amount of points>',
    minArgs: 2,
    maxArgs: 2,
    permission: 'ADMINISTRATOR',
    callback: async (message, arguments, text) => {
        const {guild} = message
        const target = message.mentions.users.first() || message.author
    
        if(isNaN(arguments[1])) return message.reply(`${language(guild, "VALID_NUMBER")}`);
    
        const userId = target.id
        const xp = await profile.addxp(guild.id, userId, arguments[1])
    
        message.channel.send(`${target} ${language(guild, "HAS_RECIVED")} ${arguments[1]} points, ${language(guild, "NOW_HAS")} ${xp} points`)
    },
  }
  