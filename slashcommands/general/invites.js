const d = require('discord.js');
const language = require('../../language')
require('dotenv').config()

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("invite")
        .setDescription("Create an invitation link for the bot.")
        .setDescriptionLocalizations({
            fr: "Crée un lien d'invitation pour le bot.",
            nl: 'Maak een uitnodigingslink voor de bot.',
        }),

    async execute(interaction, client) {
        const { guild } = interaction
        const clientId = process.env.CLIENT_ID
        const invite = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot+applications.commands`

        const inviteButton = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder()
                .setLabel(`${language(guild, "INVITE_BUT")}`)
                .setStyle(d.ButtonStyle.Link)
                .setURL(`${invite}`)
            )

        interaction.reply({
            content: `${language(guild, "INVITE")}` + invite,
            components: [inviteButton]
        })
    }
}