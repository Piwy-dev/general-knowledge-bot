const language = require('../language')
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bug")
        .setDescription("repport a bug to the bot's creator")
        .setDescriptionLocalizations({
            fr: 'Rapporte un bug au créateur du bot',
            nl: 'Rapporteer een bug aan de maker van de bot.',
        })
        .addStringOption((option) => option
            .setName("bug")
            .setDescription("The descrition of the bug you want to repport")
            .setDescriptionLocalizations({
                fr: 'La description du bug que vous voulez rapporter',
                nl: 'De beschrijving van de bug die u wilt rapporteren',
            })
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { guild } = interaction

        client.guilds.cache.get('791608838209142796').channels.cache.get('905095177855713320').send(
            `**New bug:** \nBug repported by: <@${interaction.user.id}> \nContent: ` + interaction.options.getString("bug"))

        interaction.reply(`${language(guild, "BUG")}` + interaction.options.getString("bug"))
    }
}