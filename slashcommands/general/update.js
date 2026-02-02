const d = require('discord.js');
const language = require('../../language')

module.exports = {
    data: new d.SlashCommandBuilder()
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
        .setDefaultMemberPermissions(d.PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        const { guild, channel } = interaction

        const updateEmbed = new d.EmbedBuilder()
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

        const invite = client.generateInvite({ scopes: ['bot', 'applications.commands'], permissions: [d.PermissionsBitField.Flags.Administrator] })

        const buttons = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder()
                .setLabel(`${language(guild, "INVITE_BUT")}`)
                .setStyle(d.ButtonStyle.Link)
                .setURL(`${invite}`)
            )

        channel.send({
            embeds: [updateEmbed],
            components: [buttons]
        })

        await interaction.reply({ content: `${language(guild, "UPD_SENT")}`, flags: d.MessageFlags.Ephemeral })
    }
}