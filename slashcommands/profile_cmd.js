const profile = require('../bdd/profile')
const language = require('../language')

const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Shows the points of an user")
        .addUserOption((option) => option
            .setName('user')
            .setDescription('The user of witch you want to see the profile.')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { guild, options } = interaction

        await interaction.deferReply();

        const target = options.getUser('user')

        const xp = await profile.addxp(guild.id, target.id, 0)

        interaction.editReply(`${target} ${language(guild, "HAS")} ${xp} points`)
    }
}