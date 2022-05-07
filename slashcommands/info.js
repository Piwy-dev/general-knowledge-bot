const Discord = require('discord.js')
const { MessageActionRow, MessageButton, Permissions } = require('discord.js')
const language = require('../language')

const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("shows how to use the bot"),

    async execute(interaction, client) {
        const { guild } = interaction;

        const mainEmbed = new Discord.MessageEmbed()
            .setColor('#3B5998')
            .setTitle('Informations')
            .setDescription(`${language(guild, "INFO_THANKS")}`)
            .addFields({ name: `${language(guild, "GEN_INFO")}`, value: `${language(guild, "GEN_INFO_VALUE")}` }, )
            //.setFooter(`${language(guild, "INFO_FOOTER")}`);

        const testEmbed = new Discord.MessageEmbed()
            .setColor('#61cdff')
            .setTitle(`${language(guild, "TEST_CMD")}`)
            .setDescription(`${language(guild, "TEST_CMD_DESCR")}`)
            .addFields({ name: `${language(guild, "TRUE_FALSE")}`, value: `${language(guild, "TRUE_FALSE_DESCR")}` }, { name: `${language(guild, "FLAG_TEST")}`, value: `${language(guild, "FLAG_TEST_DESCR")}` }, { name: `${language(guild, "CAPITAL_TEST")}`, value: `${language(guild, "CAPITAL_TEST_DESCR")}` }, { name: `${language(guild, "LOGO_TEST")}`, value: `${language(guild, "LOGO_TEST_DESCR")}` });

        const profileEmbed = new Discord.MessageEmbed()
            .setColor('#ff6b61')
            .setTitle(`${language(guild, "POINT_CMD")}`)
            .setDescription(`${language(guild, "POINT_CMD_DESCR")}`)
            .addFields({ name: `${language(guild, "PROFILE_CMD")}`, value: `${language(guild, "PROFILE_CMD_DESCR")}` }, { name: `${language(guild, "LEAD_CMD")}`, value: `${language(guild, "LEAD_CMD_DESCR")}` }, { name: `${language(guild, "ADMINXP_CMD")}`, value: `${language(guild, "ADMINXP_CMD_DESCR")}` });

        const configurationEmbed = new Discord.MessageEmbed()
            .setColor('#9861ff')
            .setTitle(`${language(guild, "CONFIG_CMD")}`)
            .setDescription(`${language(guild, "CONFIG_CMD_DESCR")}`)
            .addFields({ name: `${language(guild, "SETLANG_CMD")}`, value: `${language(guild, "SETLANG_DESCR")}` });

        const invite = client.generateInvite({ scopes: ['bot', 'applications.commands'], permissions: [Permissions.FLAGS.ADMINISTRATOR] });
        const invitesButton = new MessageActionRow()
            .addComponents(
                new MessageButton() // Création du bouton d'invitation
                .setLabel('Invite the bot')
                .setStyle('LINK')
                .setURL(`${invite}`)
            )
            .addComponents(
                new MessageButton() // Création du bouton pour recevoir le lien du serv de support
                .setLabel('Join support server')
                .setStyle('LINK')
                .setURL('https://discord.gg/PhCdM465np')
            );

        interaction.reply({
            embeds: [mainEmbed, testEmbed, profileEmbed, configurationEmbed],
            components: [invitesButton],
        })
    }
}