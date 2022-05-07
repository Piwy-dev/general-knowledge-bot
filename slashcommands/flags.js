const profile = require('../bdd/profile')
const language = require('../language')

const { flags } = require('../Json FILES/flags.json');
const { contries } = require('../Json FILES/contries.json');

const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("flags")
        .setDescription("Test our your knowledge in flags"),

    async execute(interaction, client) {
        const { guild, member, channel } = interaction

        await interaction.deferReply()

        var i = Math.floor(Math.random() * Math.floor(flags.length));

        await interaction.editReply(`${member} ${language(guild, "CONTRY_NAME")}`);
        channel.send(flags[i]);

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
                var similarity;
                var propositions;

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

                propositions = contries[i].split(", ");
                for (var prop = 0, p = propositions.length; p--;) {
                    console.log(propositions[prop])
                    similarity = Compare(propositions[p].toLocaleLowerCase(), collectedMessage.content.toLowerCase())
                        // Si une des réponse est bonne
                    if (similarity > 0.5) {
                        collectedMessage.reply(`${member} ${language(guild, "WIN_XP")} 10 points!`);
                        profile.addxp(guild.id, member.id, 10)
                        break;
                    }
                    // Si aucune des réponse n'est bonne
                    else if (similarity <= 0.5 && p == 0) {
                        collectedMessage.reply(`${member} ${language(guild, "LOSE_XP")} 5 points ! ${language(guild, "ANSWER_WAS")} ${propositions[prop]}`);
                        profile.addxp(guild.id, member.id, -5)
                        break
                    }
                }
            }
            // Si il n'a écrit aucun message avant 15s
            else {
                channel.send({
                    content: `${member}, ${language(guild, "QST_OUTDATED_1")} 5 ${language(guild, "QST_OUTDATED_2")} ${contries[i]}`
                });
                profile.addxp(guild.id, member.id, -5)
            }
        });
    }
}