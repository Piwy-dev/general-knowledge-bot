const language = require('../language')

const { MessageActionRow, MessageButton } = require('discord.js')

const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("credits")
        .setDescription("Shows the bot's credits"),

    async execute(interaction, client) {
        const { guild } = interaction

        interaction.reply(`${language(guild, "CREDITS")}`)
    }
}