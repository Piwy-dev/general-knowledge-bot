const language = require('../../language')

const d = require('discord.js')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("credits")
        .setDescription("Shows the bot's credits"),

    async execute(interaction, client) {
        const { guild } = interaction

        interaction.reply(`${language(guild, "CREDITS")}`)
    }
}