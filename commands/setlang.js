const { languages } = require('../lang.json');
const mongo = require('../bdd/mongo')
const languageSchema = require('../bdd/language-schema');
const { setLanguage } = require('../language')


module.exports = {
    commands: ['setlang', 'setlanguage'],
    expectedArgs: '<new language>',
    minArgs: 1,
    maxArgs: 1,
    permission: 'ADMINISTRATOR',
    callback: async (message, arguments) => {
        const { guild } = message

        const targetLanguage = arguments[0].toLowerCase()
        if (!languages.includes(targetLanguage)) return message.reply("That language is not supported. Supported languages: english, french")

        setLanguage(guild, targetLanguage)
        
        await mongo().then(async (mongoose) => {
            try {
                await languageSchema.findOneAndUpdate({
                    _id: guild.id
                }, {
                    _id: guild.id,
                    language: targetLanguage
                }, {
                    upsert: true
                })

                message.channel.send(`The language has been change to ${targetLanguage}`)

            } finally {
                mongoose.connection.close()
            }
        })

    },
}
