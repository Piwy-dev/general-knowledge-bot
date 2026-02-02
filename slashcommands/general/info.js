const d = require('discord.js');
const language = require('../../language')
const { mainEmbed, testEmbed, irrverbsEmbed, studyEmbed, profileEmbed, configurationEmbed, inviteButtons } = require('../../builders')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("info")
        .setDescription("shows how to use the bot")
        .setDescriptionLocalizations({
            fr: 'Montre comment utiliser le bot.',
        }),

    async execute(interaction) {
        const { guild } = interaction;

        interaction.reply({
            embeds: [mainEmbed(guild), testEmbed(guild), irrverbsEmbed(guild), studyEmbed(guild), profileEmbed(guild), configurationEmbed(guild)],
            components: [inviteButtons(guild)],
            flags: d.MessageFlags.Ephemeral
        })
    }
}