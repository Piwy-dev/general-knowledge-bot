const language = require('../language')
const profile = require('../bdd/profile')

const { Permissions } = require('discord.js')

const { SlashCommandBuilder } = require('@discordjs/builders')

let amountXp

module.exports = {
    data: new SlashCommandBuilder()
        .setName("adminxp")
        .setDescription("Changes the xp points of an user")
        .addUserOption((option) => option
            .setName('user')
            .setDescription('The user you want to chage the points.')
            .setRequired(true)
        )
        .addNumberOption((option) => option
            .setName('points')
            .setDescription('The number of points you want to change between -1000 and 1000.')
            .setMaxValue(1000)
            .setRequired(true)
        )
        .addBooleanOption((option) => option
            .setName('add')
            .setDescription('Do you want to add or remove the points')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { guild, member, options } = interaction

        await interaction.deferReply();

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.editReply({
            content: 'Only administrators can use this command',
        })

        const target = options.getUser('user')
        const add = options.getBoolean('add')

        if (add) { amountXp = options.getNumber('points') }
        else { amountXp = -options.getNumber('points') }

        const xp = await profile.addxp(guild.id, target.id, amountXp)

        interaction.editReply(`${target} ${language(guild, "HAS_RECIVED")} ${amountXp} points, ${language(guild, "NOW_HAS")} ${xp} points`)
    }
}