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
            .addField("New", "→ A message is send to a specific channel when the bot is added to a server. \n→ Setup of a time of 15 seconds limit to answer for the flags, capitals and logos tests. \n→ Adding of English translations to some countries and capitals.")
            .addField("Coming next", "→ Change to the right countries and capitals translations when the language is changed. \n→ Dutch translation (commands only).")
            .setFooter("Bot updated by Piwy#2703")

        channel.send({
            embeds: [updateEmbed]
        })
    }
}