const Discord = require('discord.js')
const language = require('../language')

module.exports = {
    commands: ['info', 'help'],
    callback: async (message, arguments, text, client) => {
        let msg;
        let newmsg;

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
            .setFooter(`${language(guild, "RETURN")}`);


        profileEmbed = new Discord.MessageEmbed()
            .setColor('#3B5998')
            .setTitle(`${language(guild, "POINT_CMD")}`)
            .setDescription(`${language(guild, "POINT_CMD_DESCR")}`)
            .addFields(
                { name: `${language(guild, "PROFILE_CMD")}`, value: `${language(guild, "PROFILE_CMD_DESCR")}` },
                { name: `${language(guild, "LEAD_CMD")}`, value: `${language(guild, "LEAD_CMD_DESCR")}` },
                { name: `${language(guild, "ADMINXP_CMD")}`, value: `${language(guild, "ADMINXP_CMD_DESCR")}` },
            )
            .setFooter(`${language(guild, "RETURN")}`);

        configurationEmbed = new Discord.MessageEmbed()
            .setColor('#3B5998')
            .setTitle(`${language(guild, "CONFIG_CMD")}`)
            .setDescription(`${language(guild, "CONFIG_CMD_DESCR")}`)
            .addFields(
                { name: `${language(guild, "SETLANG_CMD")}`, value: `${language(guild, "SETLANG_DESCR")}` },
            )
            .setFooter(`${language(guild, "RETURN")}`);

        msg = await message.channel.send(mainEmbed);
        msg.react('📝')
        msg.react('📈')
        msg.react('⚙️')

        client.on('messageReactionAdd', async (reaction, user) => {
            if (user.bot) return;

            if (reaction.message.id === msg.id) { // Pour le message principal
                if (reaction.emoji.name === '📝') {
                    newmsg = await msg.channel.send(testEmbed)
                    msg.delete().catch(e => { console.log(e) });
                    newmsg.react('🚪')
                } else if (reaction.emoji.name === '📈') {
                    newmsg = await msg.channel.send(profileEmbed)
                    msg.delete().catch(e => { console.log(e) });
                    newmsg.react('🚪')
                } else if (reaction.emoji.name === '⚙️') {
                    newmsg = await msg.channel.send(configurationEmbed)
                    msg.delete().catch(e => { console.log(e) });
                    newmsg.react('🚪')
                } else return;
            } else if (reaction.message.id === newmsg.id) { // Pour les autres embeds
                if (reaction.emoji.name === '🚪') {
                    msg = await reaction.message.channel.send(mainEmbed);
                    msg.react('📝')
                    msg.react('📈')
                    msg.react('⚙️')

                    if (newmsg === undefined) return;
                    newmsg.delete().catch(e => { console.log(e) });

                } else return;
            } else return;
        })
    }
}