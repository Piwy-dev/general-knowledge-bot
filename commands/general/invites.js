const { Permissions, MessageActionRow, MessageButton } = require('discord.js');
const language = require('../../language')

module.exports = {
    commands: ['invites', 'invite'],

    callback: async (message, args, text, client) => {
        const { guild } = message
        const invite = client.generateInvite({ scopes: ['bot'], permissions: [Permissions.FLAGS.ADMINISTRATOR] })

        const inviteButton = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('Invite the bot')
                .setStyle('LINK')
                .setURL(`${invite}`)
        )

        message.reply({
            content: `${language(guild, "INVITE")}` + invite,
            components: [inviteButton]
        })
    },
}
