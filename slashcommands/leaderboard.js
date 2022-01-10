const language = require('../language')
const profileSchema = require('../bdd/profile-schema')
const mongo = require('../bdd/mongo')

const { MessageEmbed } = require('discord.js')

const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the leaderboard."),

  async execute(interaction, client) {
    const { guild } = interaction
    const guildId = guild.id

    await interaction.deferReply()

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
    const leaderboardEmbed = new MessageEmbed()
      .setColor('#3B5998')
      .setTitle('LeaderBoard')
      .setDescription(topMembers)
    interaction.editReply({ embeds: [leaderboardEmbed] });
  }
}