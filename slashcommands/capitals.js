const language = require('../language')
const profile = require('../bdd/profile')

const { contries } = require('../Json FILES/capContries.json');
const { capitals } = require('../Json FILES/capitals.json');

const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("capitals")
        .setDescription("Test out your knowledge in capitals"),

    async execute(interaction) {
        const { guild, member, channel } = interaction

        await interaction.deferReply()

        var i = Math.floor(Math.random() * Math.floor(contries.length));

        interaction.editReply({ content: `${member} ${language(guild, "CAPITAL")} ${contries[i]} ?` });

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

                var similarity = Compare(capitals[i].toLowerCase(), collectedMessage.content.toLowerCase());

                // Si la réponse est bonne
                if (similarity > 0.5) {
                    collectedMessage.reply({
                        content: `${member} ${language(guild, "WIN_XP")} 8 points!`
                    });
                    profile.addxp(guild.id, member.id, 8)
                }
                // Si la réponse est fausee
                else {
                    collectedMessage.reply({
                        content: `${member} ${language(guild, "LOSE_XP")} 3 points! ${language(guild, "ANSWER_WAS")} ${capitals[i]}`
                    });
                    profile.addxp(guild.id, member.id, -3)
                }
            }
            // Si il n'a écrit aucun message avant 15s
            else {
                channel.send({
                    content: `${member}, ${language(guild, "QST_OUTDATED_1")} 5 ${language(guild, "QST_OUTDATED_2")} ${capitals[i]}`
                });
                profile.addxp(guild.id, member.id, -5)
            }
        });
    }
}