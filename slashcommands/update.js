const { Permissions, MessageEmbed } = require('discord.js');
const language = require('../language')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setDescription("Shows the updates logs."),

    async execute(interaction, client) {
        const { guild, member, channel } = interaction

        // Vérifie que le membre aie la permission
        if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.editReply({
            content: 'Only administrators can use this command',
        })

        const updateEmbed = new MessageEmbed()
            .setTitle('Bot updated (version 1.3.3)')
            .setThumbnail('https://pbs.twimg.com/profile_images/1480638649008066569/ZYdgTYU-_400x400.jpg')
            .setColor('#7dffa0')
            .addField("Changes", "→ Modification in the verifying system for the true or false and adding of the translations in English. \n→ Update of the questions of the true or false. \n→ New informations after the answers of the true or false. \n→ Correction of bugs.")
            .addField("Coming next", "→ Translations in English of countries and capitals. \n→ Modification of the verifying system for countries flags and capitals tests")
            .setFooter("Bot updated by Piwy#2703")

        interaction.reply({ content: '<@&905094492074438676>' });

        channel.send({
            embeds: [updateEmbed]
        })
    }
}
