const d = require('discord.js')

/** 
* Compares two strings. 
* @param {string} str1
* @param {string} str2
* @returns {number} a number between 0 and 1 representing the percentage of similarity between the two strings
*/ 
function CompareStrings(str1, str2) {
    for (var result = 0, i = str1.length; i--;) {
        if (typeof str2[i] == 'undefined' || str1[i] == str2[i]);
        else if (str1[i].toLowerCase() == str2[i].toLowerCase())
            result++;
        else
            result += 4;
    }
    return 1 - (result + 4 * Math.abs(str1.length - str2.length)) / (2 * (str1.length + str2.length));
}

/** 
 * Sends a message with the verb to translate
 * @param {Discord.Guild} guild
 * @param {Discord.TextChannel} channel - the channel where the message will be sent
 * @param {Object} verbList - the list of verbs
 * @returns {List} [the message sent, the id of the language of translation]
 */
async function SendVerbMessage(guild, channel, verbList, langTrad) {
    // Choisi un nombre aléatoire entre 0 et la longueur de la liste
    const randomVerb = Math.floor(Math.random() * verbList.verbs.length)

    // Crée le bouton
    const infButton = new d.ActionRowBuilder()
        .addComponents(
            new d.ButtonBuilder()
            .setCustomId('infButton')
            .setLabel(`${language(guild, "GIVE_ANSW")}`)
            .setStyle(d.ButtonStyle.Success)
        )

    // Get the traduction language
    let lan = 0
    if(langTrad === "french") lan = 3
    else if(langTrad === "english" || "dutch") lan = 0

    // Envoie le message
    const message = await channel.send({ 
        content: `${language(guild, "INFINITIVE").replace("{0}", langTrad)
           .replace("{1}", verbList.verbs[randomVerb][lan])}`,
        components: [infButton]
    })

    return [message, lan]
}

module.exports = {
    CompareStrings,
    SendVerbMessage
}