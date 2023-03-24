const { languages } = require('../lang.json');
const mongo = require('../db/mongo')
const languageSchema = require('../db/language-schema');
const { setLanguage } = require('../language')

const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlang")
        .setDescription("Change the language used by the bot.")
        .addStringOption((option) => option
            .setName("language")
            .setDescription("The new language name")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        const { guild } = interaction

        await interaction.deferReply({ ephemeral: true })

        const targetLanguage = interaction.options.getString("language").toLowerCase()
        if (!languages.includes(targetLanguage)) return interaction.editReply("That language is not supported. Supported languages: english, french")

        setLanguage(guild, targetLanguage)

        await mongo().then(async(mongoose) => {
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