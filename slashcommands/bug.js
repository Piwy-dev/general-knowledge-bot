const language = require('../language')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bug")
        .setDescription("repport a bug to the bot's creator")
        .addStringOption((option) => option
            .setName("bug")
            .setDescription("The descrition of the bug you want to repport")
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { guild } = interaction

        client.guilds.cache.get('791608838209142796').channels.cache.get('905095177855713320').send(
            `**New bug:** \nBug repported by: <@${interaction.user.id}> \nContent: ` + interaction.options.getString("bug"))

        interaction.reply(`${language(guild, "BUG")}` + interaction.options.getString("bug"))
    }
}