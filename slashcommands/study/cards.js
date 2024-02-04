const d = require('discord.js')

const language = require('../../language')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("cards")
        .setNameLocalizations({
            fr: "fiches",
            nl: "kaarten"
        })
        .setDescription("Shows a card from a theme")
        .setDescriptionLocalizations({
            fr: "Affiche une fiche d'un thème",
            nl: "Toont een kaart van een thema"
        }),

    async execute(interaction, client) {
        const { guild } = interaction

        // create the menu to select the theme
        const themeMenu = new d.StringSelectMenuBuilder()
            .setCustomId('cardtheme')
            .setPlaceholder(language(guild, 'COURSES_SELECT'))
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(
                new d.StringSelectMenuOptionBuilder()
					.setLabel(language(guild, 'ALGEBRA'))
					.setValue('algebra'),
                new d.StringSelectMenuOptionBuilder()
					.setLabel(language(guild, 'ALGORITHMICS'))
					.setValue('algorithmics'),
                new d.StringSelectMenuOptionBuilder()
					.setLabel(language(guild, 'ELECTRONICS'))
					.setValue('electronics'),
                new d.StringSelectMenuOptionBuilder()
					.setLabel(language(guild, 'MARKETING'))
					.setValue('marketing'),
            )

        const row = new d.ActionRowBuilder()
            .addComponents(themeMenu)
    
        const embed = new d.EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(language(guild, 'COURSES'))
            .setDescription(language(guild, 'COURSES_DESC'))

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })
    }
}