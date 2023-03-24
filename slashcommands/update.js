const discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const language = require('../language')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("update")
        .setNameLocalizations({
            fr: "mise-à-jour",
            nl: "update",
        })
        .setDescription("Shows the updates logs.")
        .setDescriptionLocalizations({
            fr: "Affiche les logs de mise à jour.",
            nl: 'Toont de update logs.',
        })
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        const { guild, channel } = interaction

        const updateEmbed = new EmbedBuilder()
            .setTitle(`${language(guild, "UPD_TITLE")} 1.3.6`)
            .setThumbnail('https://pbs.twimg.com/profile_images/1480638649008066569/ZYdgTYU-_400x400.jpg')
            .setColor('#7dffa0')
            .addFields({
                name: `${language(guild, 'UPD_NEWS')}`,
                value: `${language(guild, 'UPD_NEWS_VALUE')}`,
            }, {
                name: `${language(guild, 'UPD_FIXES')}`,
                value: `${language(guild, 'UPD_FIXES_VALUE')}`,
            }, /*{
                name: `${language(guild, 'UPD_IMP')}`,
                value: `${language(guild, 'UPD_IMP_VALUE')}`,
            },*/ {
                name: `${language(guild, 'UPD_COMMING')}`,
                value: `${language(guild, 'UPD_COMMING_VALUE')}`,
            })
            .setFooter({ text: "Bot mis à jour by Piwy#2703" })

        const invite = client.generateInvite({ scopes: ['bot', 'applications.commands'], permissions: [discord.PermissionsBitField.Flags.Administrator] })

        const buttons = new discord.ActionRowBuilder()
            .addComponents(
                new discord.ButtonBuilder()
                .setLabel(`${language(guild, "INVITE_BUT")}`)
                .setStyle(discord.ButtonStyle.Link)
                .setURL(`${invite}`)
            )

        channel.send({
            embeds: [updateEmbed],
            components: [buttons]
        })

        await interaction.reply({ content: `${language(guild, "UPD_SENT")}`, ephemeral: true })
    }
}