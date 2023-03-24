const language = require('../language')

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("credits")
        .setDescription("Shows the bot's credits"),

    async execute(interaction, client) {
        const { guild } = interaction

        interaction.reply(`${language(guild, "CREDITS")}`)
    }
}