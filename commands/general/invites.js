const { Permissions } = require('discord.js');
const language = require('../../language')

module.exports = {
    commands: ['invites', 'invite'],

    callback: async ( message, args, text, client ) => {
        const {guild} = message
        const invite = client.generateInvite({ scopes: ['bot'], permissions: [Permissions.FLAGS.ADMINISTRATOR] })
        message.reply(`${language(guild, "INVITE")}` + invite)
    },
}
