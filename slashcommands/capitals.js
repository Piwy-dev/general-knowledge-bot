const language = require('../language')
const profile = require('../bdd/profile')

const { contries } = require('../Json FILES/capContries.json');
const { capitals } = require('../Json FILES/capitals.json');

const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("capitals")
        .setDescription("Test out your knowledge in capitals"),

    async execute(interaction, client) {
        const { guild, member, channel } = interaction

        await interaction.deferReply()

        var i = Math.floor(Math.random() * Math.floor(contries.length));

        interaction.editReply({ content: `${member} ${language(guild, "CAPITAL")}${contries[i]} ?` });

        var canAnswer = true

        client.on("messageCreate", msg => {
            if (msg.member.id !== member.id) return;  // Verifie que ce sois le bon auteur
            if (msg.author.id === "803979491373219840") return; // Verifie qeu ce ne sois pas le bot qui réponde
            if (!canAnswer) return

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

            var similarity = Compare(capitals[i].toLowerCase(), msg.content.toLowerCase());

            if (similarity > 0.5) {
                msg.reply({ 
                    content: `${member} ${language(guild, "WIN_XP")} 8 points!` 
                });
                profile.addxp(guild.id, member.id, 8)
                canAnswer = false
            }
            else {
                msg.reply({
                    content: `${member} ${language(guild, "LOSE_XP")} 3 points! ${language(guild, "ANSWER_WAS")} ${capitals[i]}`
                });
                profile.addxp(guild.id, member.id, -3)
                canAnswer = false
            }
        })
    }
}