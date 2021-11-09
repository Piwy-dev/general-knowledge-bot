const Discord = require('discord.js')
const language = require('../../language')
const profileSchema = require('../../bdd/profile-schema')
const mongo = require('../../bdd/mongo')

module.exports = {
  commands: ['leaderboard', 'l'],
  callback: async (message, arguments, text) => {
    const {guild} = message

    const guildId = message.guild.id

    const topMembers = await mongo().then(async (mongoose) => {
      try {
        text = ''
        const results = await profileSchema
        .find({
          guildId,
        })
        .sort({
          xp: -1,
        })
        .limit(20)

  for (let counter = 0; counter < results.length; ++counter) {
    const { userId, xp = 0 } = results[counter]

    text += `#${counter + 1} <@${userId}> ${language(guild, "WITH")} ${xp} points\n`
  }
  return text
} finally {
  mongoose.connection.close()
}
})
    const newEmbed = new Discord.MessageEmbed()
    .setColor('#3B5998')
    .setTitle('LeaderBoard')
    .setDescription(topMembers)
    message.channel.send({embeds: [newEmbed]});
  },
}
