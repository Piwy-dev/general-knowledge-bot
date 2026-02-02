const d = require('discord.js')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("setlang")
        .setDescription("Change the language used by the bot.")
        .setDefaultMemberPermissions(d.PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ flags: d.MessageFlags.Ephemeral })

        // Create a string sellection menu with all the languages
        const l = new d.StringSelectMenuBuilder()
            .setCustomId("language")
            .setPlaceholder("Select a language")
            .addOptions([
                new d.StringSelectMenuOptionBuilder()
                    .setLabel("English 🇬🇧")
                    .setValue("english"),
                new d.StringSelectMenuOptionBuilder()
                    .setLabel("Français 🇫🇷")
                    .setValue("french"),
                new d.StringSelectMenuOptionBuilder()
                    .setLabel("Nederlands 🇳🇱")
                    .setValue("dutch")
            ])

        const row = new d.ActionRowBuilder()
            .addComponents(l)

        await interaction.editReply({ components: [row] })
    }
}