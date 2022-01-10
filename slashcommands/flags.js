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

        var canAnswer = true

        client.on("messageCreate", msg => {
            if (msg.member.id !== member.id) return;  // Verifie que ce sois le bon auteur
            if (msg.author.id === "803979491373219840") return; // Verifie qeu ce ne sois pas le bot qui réponde
            if (!canAnswer) return

            var similarity;
            var propositions;
            var verification = false;

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

            if(contries[i].includes(", ")){ // Si il y a plusieurs solution pour le pays
                propositions = contries[i].split(", ");
                for(var prop = 0, p = propositions.length; p--;){
                    similarity = Compare(propositions[p].toLocaleLowerCase() , msg.content.toLowerCase())
                    if(similarity > 0.5){ // Si une des réponse est bonne
                        verification = true;
                        break;
                    } else if (similarity <= 0.5 && p == 0) {
                        verification = false;
                        break
                    }
                }
            }
            else // Si il n'y a qu'une seule solution possible
            {
                similarity = Compare(contries[i].toLowerCase(), msg.content.toLowerCase());
                if(similarity > 0.5){ // Si une des réponse est bonne
                    verification = true;
                } else {
                    verification = false;
                }
            }

            if (verification) { // Si la réponse est bonne
                msg.reply(`${member} ${language(guild, "WIN_XP")} 10 points!`);
                profile.addxp(guild.id, member.id, 10)
                canAnswer = false
            }
            else { // Si elle est fausse
                msg.reply(`${member} ${language(guild, "LOSE_XP")} 5 points ! ${language(guild, "ANSWER_WAS")} ${contries[i]}`);
                profile.addxp(guild.id, member.id, -5)
                canAnswer = false
            }
        })
    }
}