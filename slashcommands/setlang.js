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

const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlang")
        .setDescription("Change the language used by the bot.")
        .addStringOption((option) => option
            .setName("language")
            .setDescription("The new language name")
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { guild } = interaction

        await interaction.deferReply({ephemeral: true})

        const targetLanguage = interaction.options.getString("language").toLowerCase()
        if (!languages.includes(targetLanguage)) return interaction.editReply("That language is not supported. Supported languages: english, french")

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

                interaction.editReply(`The language has been changed to ${targetLanguage}`)

            } finally {
                mongoose.connection.close()
            }
        })
    }
}