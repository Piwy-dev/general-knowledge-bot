const d = require('discord.js');
const language = require('../../language')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("info")
        .setDescription("shows how to use the bot")
        .setDescriptionLocalizations({
            fr: 'Montre comment utiliser le bot.',
            nl: 'Toont hoe de bot te gebruiken',
        }),

    async execute(interaction, client) {
        const { guild, channel } = interaction;

        const mainEmbed = new d.EmbedBuilder()
            .setColor('#3B5998')
            .setTitle('Informations')
            .setDescription(`${language(guild, "INFO_THANKS")}`)
            .addFields({
                name: `${language(guild, "GEN_INFO")}`, 
                value: `${language(guild, "GEN_INFO_VALUE")}` 
            });
        //.setFooter(`${language(guild, "INFO_FOOTER")}`);

        const testEmbed = new d.EmbedBuilder()
            .setColor('#61cdff')
            .setTitle(`${language(guild, "TEST_CMD")}`)
            .setDescription(`${language(guild, "TEST_CMD_DESCR")}`)
            .addFields({
                name: `${language(guild, "TRUE_FALSE")}`,
                value: `${language(guild, "TRUE_FALSE_DESCR")}`
            }, {
                name: `${language(guild, "FLAG_TEST")}`,
                value: `${language(guild, "FLAG_TEST_DESCR")}`
            }, {
                name: `${language(guild, "CAPITAL_TEST")}`,
                value: `${language(guild, "CAPITAL_TEST_DESCR")}`
            }, {
                name: `${language(guild, "LOGO_TEST")}`,
                value: `${language(guild, "LOGO_TEST_DESCR")}`
            });

        const irrverbsEmbed = new d.EmbedBuilder()
            .setColor('#69c280')
            .setTitle(`${language(guild, "IRREGUAR_VERBS_CMD")}`)
            .addFields({
                name: `${language(guild, "VERBS_LIST")}`,
                value: `${language(guild, "VERBS_LIST_DESCR")}`
            }, {
                name: `${language(guild, "STUDY_INF")}`,
                value: `${language(guild, "STUDY_INF_DESCR")}`
            }, {
                name: `${language(guild, "STUDY_IMPERF")}`,
                value: `${language(guild, "STUDY_IMPERF_DESCR")}`
            }, {
                name: `${language(guild, "STUDY_PAST_PART")}`,
                value: `${language(guild, "STUDY_PAST_PART_DESCR")}`
            });

        const profileEmbed = new d.EmbedBuilder()
            .setColor('#ff6b61')
            .setTitle(`${language(guild, "POINT_CMD")}`)
            .setDescription(`${language(guild, "POINT_CMD_DESCR")}`)
            .addFields({ name: `${language(guild, "PROFILE_CMD")}`, value: `${language(guild, "PROFILE_CMD_DESCR")}` }, { name: `${language(guild, "LEAD_CMD")}`, value: `${language(guild, "LEAD_CMD_DESCR")}` }, { name: `${language(guild, "ADMINXP_CMD")}`, value: `${language(guild, "ADMINXP_CMD_DESCR")}` });

        const configurationEmbed = new d.EmbedBuilder()
            .setColor('#9861ff')
            .setTitle(`${language(guild, "CONFIG_CMD")}`)
            .setDescription(`${language(guild, "CONFIG_CMD_DESCR")}`)
            .addFields({
                name: `${language(guild, "SETLANG_CMD")}`,
                value: `${language(guild, "SETLANG_DESCR")}`
            });

        const invitesButton = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder() // Création du bouton d'invitation
                    .setLabel('Invite the bot')
                    .setStyle(d.ButtonStyle.Link)
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=803979491373219840&permissions=2147601472&scope=bot%20applications.commands`)
            )
            .addComponents(
                new d.ButtonBuilder() // Création du bouton pour recevoir le lien du serv de support
                    .setLabel('Join support server')
                    .setStyle(d.ButtonStyle.Link)
                    .setURL('https://discord.gg/PhCdM465np')
            );

        interaction.reply({
            embeds: [mainEmbed, testEmbed, irrverbsEmbed,profileEmbed, configurationEmbed],
            components: [invitesButton],
        })
    }
}