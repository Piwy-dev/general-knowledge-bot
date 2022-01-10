const { MessageAttachment } = require("discord.js")

const profile = require('../bdd/profile')

const logo = require('../Json FILES/logo.json')

const language = require('../language')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("logo")
        .setDescription("Test out your knowledge in logos."),

    async execute(interaction, client) {
        const { guild, user } = interaction

        var i =  1 + Math.floor(Math.random() * 71);

        const attachement = new MessageAttachment(logo.logos[i]["image"])
        await interaction.reply({
            content: `${language(guild, "LOGO")}`,
            files: [attachement]
        })

        var canAnswer = true

        client.on("messageCreate", msg => {
            if (msg.author !== user) return;  // Verifie que ce sois le bon auteur
            if (msg.author.id === "803979491373219840") return; // Verifie que ce ne sois pas le bot qui réponde
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

            var similarity = Compare(logo.logos[i]["name"].toLowerCase(), msg.content.toLowerCase());

            if (similarity > 0.5) {
                msg.reply(`${user} ${language(guild, "WIN_XP")} 3 points!`);
                profile.addxp(guild.id, user.id, 3)
                canAnswer = false
            }
            else {
                msg.reply(`${user} ${language(guild, "LOSE_XP")} 5 points! ${language(guild, "ANSWER_WAS")} ${logo.logos[i]["name"]}`);
                profile.addxp(guild.id, user.id, -5)
                canAnswer = false
            }
        })
    }
}