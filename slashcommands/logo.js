const { MessageAttachment } = require("discord.js")

const profile = require('../bdd/profile')

const logo = require('../Json FILES/logo.json')

const language = require('../language')

const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("logo")
        .setDescription("Test out your knowledge in logos."),

    async execute(interaction) {
        const { guild, member, channel } = interaction

        await interaction.deferReply()

        var i = 1 + Math.floor(Math.random() * 71);

        const attachement = new MessageAttachment(logo.logos[i]["image"])
        await interaction.editReply({
            content: `${language(guild, "LOGO")}`,
            files: [attachement]
        })

        const filter = m => m.author.id === member.id

        const collector = interaction.channel.createMessageCollector({
            max: 1,
            filter,
            time: 15 * 1000
        });

        collector.on('end', collected => {
            const collectedMessage = collected.first()

            // Si l'utilisateur a écrit un message avant 15s
            if (collectedMessage) {
                function Compare(strA, strB) {
                    for (var result = 0, i = strA.length; i--;) {
                        if (typeof strB[i] == 'undefined' || strA[i] == strB[i]);
                        else if (strA[i].toLowerCase() == strB[i].toLowerCase())
                            result++;
                        else
                            result += 4;
                    }
                    return 1 - (result + 4 * Math.abs(strA.length - strB.length)) / (2 * (strA.length + strB.length));
                }

                var similarity = Compare(logo.logos[i]["name"].toLowerCase(), collectedMessage.content.toLowerCase());

                // Si la réponse est bonne
                if (similarity > 0.5) {
                    collectedMessage.reply(`${member} ${language(guild, "WIN_XP")} 3 points!`);
                    profile.addxp(guild.id, member.id, 3)
                    canAnswer = false
                }
                // Si la réponse est fausse
                else {
                    collectedMessage.reply(`${member} ${language(guild, "LOSE_XP")} 5 points! ${language(guild, "ANSWER_WAS")} ${logo.logos[i]["name"]}`);
                    profile.addxp(guild.id, member.id, -5)
                }
            }
            // Si il n'a écrit aucun message avant 15s
            else {
                channel.send({
                    content: `${member}, ${language(guild, "QST_OUTDATED_1")} 5 ${language(guild, "QST_OUTDATED_2")} ${logo.logos[i]["name"]}`
                });
                profile.addxp(guild.id, member.id, -5)
            }
        });
    }
}