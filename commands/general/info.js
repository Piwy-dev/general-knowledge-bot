const Discord = require('discord.js')
const {MessageActionRow, MessageButton, Permissions} = require('discord.js')
const language = require('../../language')

module.exports = {
    commands: ['info', 'help'],
    callback: async (message, arguments, text, client) => {
        let msg;

        let mainEmbed
        let testEmbed;
        let profileEmbed;
        let configurationEmbed;
        const { guild } = message

        mainEmbed = new Discord.MessageEmbed()
            .setColor('#3B5998')
            .setTitle('Informations')
            .setDescription(`${language(guild, "INFO_THANKS")}`)
            .addFields(
                { name: `${language(guild, "GEN_INFO")}`, value: `${language(guild, "GEN_INFO_VALUE")}` },
                { name: `${language(guild, "INFO_CMD_LIST")}`, value: `${language(guild, "INFO_CMD_LIST_VALUE")}` },
            )
            .setFooter(`${language(guild, "INFO_FOOTER")}`);

        testEmbed = new Discord.MessageEmbed()
            .setColor('#3B5998')
            .setTitle(`${language(guild, "TEST_CMD")}`)
            .setDescription(`${language(guild, "TEST_CMD_DESCR")}`)
            .addFields(
                { name: `${language(guild, "TRUE_FALSE")}`, value: `${language(guild, "TRUE_FALSE_DESCR")}` },
                { name: `${language(guild, "FLAG_TEST")}`, value: `${language(guild, "FLAG_TEST_DESCR")}` },
                { name: `${language(guild, "CAPITAL_TEST")}`, value: `${language(guild, "CAPITAL_TEST_DESCR")}` },
                { name: `${language(guild, "LOGO_TEST")}`, value: `${language(guild, "LOGO_TEST_DESCR")}` },
            )

        profileEmbed = new Discord.MessageEmbed()
            .setColor('#3B5998')
            .setTitle(`${language(guild, "POINT_CMD")}`)
            .setDescription(`${language(guild, "POINT_CMD_DESCR")}`)
            .addFields(
                { name: `${language(guild, "PROFILE_CMD")}`, value: `${language(guild, "PROFILE_CMD_DESCR")}` },
                { name: `${language(guild, "LEAD_CMD")}`, value: `${language(guild, "LEAD_CMD_DESCR")}` },
                { name: `${language(guild, "ADMINXP_CMD")}`, value: `${language(guild, "ADMINXP_CMD_DESCR")}` },
            )

        configurationEmbed = new Discord.MessageEmbed()
            .setColor('#3B5998')
            .setTitle(`${language(guild, "CONFIG_CMD")}`)
            .setDescription(`${language(guild, "CONFIG_CMD_DESCR")}`)
            .addFields(
                { name: `${language(guild, "SETLANG_CMD")}`, value: `${language(guild, "SETLANG_DESCR")}` },
            )

        // Boutons en dessous du message d'info
        const invite = client.generateInvite({ scopes: ['bot'], permissions: [Permissions.FLAGS.ADMINISTRATOR] })
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
                    .setURL('https://discord.gg/Myq4UjMrUq')
            )

        msg = await message.channel.send({
            embeds: [mainEmbed],
            components: [invitesButton]
        });

        msg.react('📝')
        msg.react('📈')
        msg.react('⚙️')

        client.on('messageReactionAdd', async (reaction, user) => {
            if (user.bot) return;

            if (reaction.message.id === msg.id) { // Pour le message principal
                if (reaction.emoji.name === '📝') {
                    await msg.channel.send({ embeds: [testEmbed],
                        components: [invitesButton] })
                } else if (reaction.emoji.name === '📈') {
                    await msg.channel.send({ embeds: [profileEmbed],
                        components: [invitesButton] })
                } else if (reaction.emoji.name === '⚙️') {
                    await msg.channel.send({
                         embeds: [configurationEmbed],
                         components: [invitesButton]
                        })
                } else return;
            } else return;
        })
    }
}