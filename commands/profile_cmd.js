const profile = require('../bdd/profile')
const language = require('../language')

module.exports = {
    commands: ['p', 'profile'],
    callback: async (message) => {
      const {guild} = message
      const target = message.mentions.users.first() || message.author
  
      const guildId = message.guild.id
      const userId = target.id
      const xp = await profile.addxp(guildId, userId, 0)
  
      message.channel.send(`${target} ${language(guild, "HAS")} ${xp} points`)
    },
  }