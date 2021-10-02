const profile = require('../bdd/profile')
const language = require('../language')

const { flags } = require('../Json FILES/flags.json');
const { contries } = require('../Json FILES/contries.json');

module.exports = {
    commands: ['flag', 'f'],
    callback: (message, argument, text, client) => {
        const {guild, channel} = message

        var i = Math.floor(Math.random() * Math.floor(flags.length));

        message.channel.send(`${message.author} ${language(guild, "CONTRY_NAME")}`);
        message.channel.send(flags[i]);

        const userId = message.author.id

        var canAnswer = true

        client.on("message", msg => {
            if (msg.author !== message.author) return;  // Verifie que ce sois le bon auteur
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

            var similarity = Compare(contries[i].toLowerCase(), msg.content.toLowerCase());

            if (similarity > 0.5) {
                channel.send(`${message.author} ${language(guild, "WIN_XP")} 10 points!`);
                profile.addxp(guild.id, userId, 10)
                canAnswer = false
            }
            else {
                channel.send(`${message.author} ${language(guild, "LOSE_XP")} 5 points ! ${language(guild, "ANSWER_WAS")} ${contries[i]}`);
                profile.addxp(guild.id, userId, -5)
                canAnswer = false
            }
        })
    },
}
