const d = require('discord.js')

const language = require('../../language')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("questions")
        .setDescription("Shows a question from a theme"),

    async execute(interaction, client) {
        const { guild } = interaction

        // create the menu to select the theme
        const themeMenu = new d.StringSelectMenuBuilder()
            .setCustomId('questiontheme')
            .setPlaceholder(language(guild, 'THEME_SELECT'))
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(
                new d.StringSelectMenuOptionBuilder()
					.setLabel(language(guild, 'PHILOSOPHY'))
					.setValue('philosophy'),
            )

        const row = new d.ActionRowBuilder()
            .addComponents(themeMenu)
    
        const embed = new d.EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(language(guild, 'QUESTIONS'))
            .setDescription(language(guild, 'QST_SELECT'))

        await interaction.reply({ 
            embeds: [embed],
            components: [row],
            flags: d.MessageFlags.Ephemeral
        })
    }
}