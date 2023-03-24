const d = require('discord.js');

const modules = require('../modules.js');
const { verbList } = require('../slashcommands/study-infintive.js');

let langTradResult = undefined

module.exports = (client) => {
    client.on(d.Events.InteractionCreate, async interaction => {

        const { guild, channel } = interaction

        // Verify if the interaction is a sellect menu
        if (!interaction.isStringSelectMenu()) return;

        // Verify if the sellect menu is the menu for sellecting the language of translation
        if(interaction.customId === 'langTrad') {
            values = interaction.values[0]
            langTradResult = modules.SendVerbMessage(guild, channel, verbList, values)
        }
    
    });
}

module.exports.langTradResult = langTradResult