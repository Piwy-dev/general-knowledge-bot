const language = require('../../language')
const profileSchema = require('../../db/profile-schema')
const mongo = require('../../db/mongo')

const d = require('discord.js')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("leaderboard")
        .setNameLocalizations({
            fr: "classement",
            nl: "ranglijst",
        })
        .setDescription("Shows the leaderboard.")
        .setDescriptionLocalizations({
            fr: "Affiche le classement.",
            nl: 'Toont de ranglijst.',
        }),

    async execute(interaction, client) {
        const { guild } = interaction
        const guildId = guild.id

        await interaction.deferReply()

        const topMembers = await mongo().then(async(mongoose) => {
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
        const leaderboardEmbed = new d.EmbedBuilder()
            .setColor('#3B5998')
            .setTitle('LeaderBoard')
            .setDescription(topMembers)
        interaction.editReply({ embeds: [leaderboardEmbed] });
    }
}