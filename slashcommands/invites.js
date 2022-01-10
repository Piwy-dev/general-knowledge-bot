const { Permissions, MessageActionRow, MessageButton } = require('discord.js');
const language = require('../language')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Create an invitation link for the bot."),

    async execute(interaction, client) {
        const { guild } = message
        const invite = client.generateInvite({ scopes: ['bot', 'applications.commands'], permissions: [Permissions.FLAGS.ADMINISTRATOR] })

        const inviteButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Invite the bot')
                .setStyle('LINK')
                .setURL(`${invite}`)
        )

        interaction.reply({
            content: `${language(guild, "INVITE")}` + invite,
            components: [inviteButton]
        })
    }
}
