const language = require('../language')
const profile = require('../db/profile')

const d = require('discord.js')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("adminxp")
        .setDescription("Changes the xp points of an user.")
        .setDescriptionLocalizations({
            fr: "Change les points d'xp d'un utilisateur.",
            nl: 'Verandert de xp punten van een gebruiker.',
        })
        .addUserOption((option) => option
            .setName('user')
            .setNameLocalizations({
                fr: 'utilisateur',
                nl: 'gebruiker',
            })
            .setDescription('The user you want to chage the points.')
            .setDescriptionLocalizations({
                fr: "L\'utilisateur dont vous voulez changer les points.",
                nl: "De gebruiker waarvan u de punten wilt wijzigen.",
            })
            .setRequired(true)
        )
        .addNumberOption((option) => option
            .setName('points')
            .setNameLocalizations({
                fr: 'points',
                nl: 'punten',
            })
            .setDescription('The number of points you want to change between -1000 and 1000.')
            .setDescriptionLocalizations({
                fr: "Le nombre de points que vous voulez changer entre -1000 et 1000.",
                nl: "Het aantal punten dat u wilt wijzigen tussen -1000 en 1000.",
            })
            .setMaxValue(1000)
            .setRequired(true)
        )
       .setDefaultMemberPermissions(d.PermissionsBitField.Flags.Administrator),

    async execute(interaction) {
        const { guild, options } = interaction

        await interaction.deferReply();

        const target = options.getUser('user')

        const amountXp = options.getNumber('points')

        const xp = profile.addxp(guild.id, target.id, amountXp)

        interaction.editReply(`${target} ${language(guild, "HAS_RECIVED")} ${amountXp} points, ${language(guild, "NOW_HAS")} ${xp} points`)
    }
}