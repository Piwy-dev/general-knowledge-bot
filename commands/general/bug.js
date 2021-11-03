const language = require('../../language')

module.exports = {
    commands: ['bug'],

    callback: async ( message, args, text, client ) => {
        const {guild} = message
        client.guilds.cache.get('791608838209142796').channels.cache.get('905095177855713320').send(
            `**New bug:** \nBug repported by: ${message.author.tag} \nContent: ` + text)
        message.reply(`${language(guild, "BUG")}` + text)
    },
}
