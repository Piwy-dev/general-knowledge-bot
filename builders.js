/* This module contains a collection of builders (embeds, buttons...) that are used in multiple commands or features. */
const d = require('discord.js');
const language = require('./language')

module.exports = {
    mainEmbed: function (guild) {
        return new d.EmbedBuilder()
            .setColor('#3B5998')
            .setTitle(language(guild, "INFO_TITLE"))
            .setDescription(`${language(guild, "INFO_THANKS")}`)
            .addFields({
                name: `${language(guild, "GEN_INFO")}`,
                value: `${language(guild, "GEN_INFO_VALUE")}`
            });
    },
    testEmbed: function (guild) {
        return new d.EmbedBuilder()
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
    },
    irrverbsEmbed: function (guild) {
        return new d.EmbedBuilder()
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
    },
    studyEmbed: function (guild) {
        return new d.EmbedBuilder()
            .setColor('#f9e1a8')
            .setTitle(`${language(guild, "STUDY_CMD")}`)
            .setDescription(`${language(guild, "STUDY_CMD_DESCR")}`)
            .addFields({
                name: `${language(guild, "QUESTIONS_CMD")}`,
                value: `${language(guild, "QUESTIONS_CMD_DESCR")}`
            }, {
                name: `${language(guild, "CARDS_CMD")}`,
                value: `${language(guild, "CARDS_CMD_DESCR")}`
            });
    },
    profileEmbed: function (guild) {
        return new d.EmbedBuilder()
            .setColor('#ff6b61')
            .setTitle(`${language(guild, "POINT_CMD")}`)
            .setDescription(`${language(guild, "POINT_CMD_DESCR")}`)
            .addFields({
                name: `${language(guild, "PROFILE_CMD")}`,
                value: `${language(guild, "PROFILE_CMD_DESCR")}`
            }, {
                name: `${language(guild, "LEAD_CMD")}`,
                value: `${language(guild, "LEAD_CMD_DESCR")}`
            },
            {
                name: `${language(guild, "ADMINXP_CMD")}`,
                value: `${language(guild, "ADMINXP_CMD_DESCR")}`
            });
    },
    configurationEmbed: function (guild) {
        return new d.EmbedBuilder()
            .setColor('#9861ff')
            .setTitle(`${language(guild, "CONFIG_CMD")}`)
            .setDescription(`${language(guild, "CONFIG_CMD_DESCR")}`)
            .addFields({
                name: `${language(guild, "SETLANG_CMD")}`,
                value: `${language(guild, "SETLANG_CMD_DESCR")}`
            })
            .setFooter({text: `${language(guild, "INFO_FOOTER")}`});
    },
    inviteButtons: function (guild) {
        return new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder() // Création du bouton d'invitation
                    .setLabel(`${language(guild, "INVITE_BUT")}`)
                    .setStyle(d.ButtonStyle.Link)
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=987825895899275304&permissions=8&scope=bot%20applications.commands') // Test
                    //.setURL('https://discord.com/api/oauth2/authorize?client_id=803979491373219840&permissions=8&scope=bot%20applications.commands') // Production
            )
            .addComponents(
                new d.ButtonBuilder() // Création du bouton pour recevoir le lien du serv de support
                    .setLabel(`${language(guild, "SUPPORT_BUT")}`)
                    .setStyle(d.ButtonStyle.Link)
                    .setURL('https://discord.gg/PhCdM465np')
            );
    }
}