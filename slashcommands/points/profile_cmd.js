const profile = require('../../db/profile')
const language = require('../../language')

const d = require('discord.js')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("profile")
        .setNameLocalizations({
            fr: "profil",
            nl: "profiel",
        })
        .setDescription("Shows the points of an user")
        .setDescriptionLocalizations({
            fr: "Affiche les points d'un utilisateur",
            nl: "Toont de punten van een gebruiker",
        })
        .addUserOption((option) => option
            .setName('user')
            .setNameLocalizations({
                fr: 'utilisateur',
                nl: 'gebruiker',
            })
            .setDescription('The user of witch you want to see the profile.')
            .setDescriptionLocalizations({
                fr: "L'utilisateur dont vous voulez voir le profil.",
                nl: "De gebruiker waarvan u het profiel wilt zien.",
            })
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { guild, options } = interaction

        await interaction.deferReply();

        const target = options.getUser('user')

        const xp = profile.addxp(guild.id, target.id, 0)

        interaction.editReply(`${target} ${language(guild, "HAS")} ${xp} points`)
    }
}