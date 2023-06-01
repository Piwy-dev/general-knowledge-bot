const d = require('discord.js');
const fs = require('fs')
const csv = require('jquery-csv')

const modules = require('../modules.js');
const { verbList } = require('../slashcommands/tests/study-infintive.js');

const language = require('../language.js')

let langTradResult = undefined

let qst_philo = []
fs.readFile('./csv/qst_philo.csv', 'utf8', (err, data) => {
    if (err) return console.error(err)
    qst_philo = csv.toArrays(data)
})

module.exports = (client) => {
    client.on(d.Events.InteractionCreate, async interaction => {

        const { guild, channel } = interaction

        // Verify if the interaction is a sellect menu
        if (!interaction.isStringSelectMenu()) return;

        await interaction.deferReply({ephemeral: true})

        // Verify if the sellect menu is the menu for sellecting the language of translation
        if(interaction.customId === 'langTrad') {
            values = interaction.values[0]
            langTradResult = modules.SendVerbMessage(guild, channel, verbList, values)
        }

        // Verify if the sellect menu is the menu for sellecting the theme of the question
        if(interaction.customId === 'questiontheme') {
            // Get the selected theme
            const selectedTheme = interaction.values[0]
            let theme = undefined
            switch(selectedTheme) {
                case 'philosophy': theme = qst_philo; break;
                case 'history': theme = qst_history; break;
            }
                
            const random = Math.floor(Math.random() * theme.length)
            const question = theme[random]

            let questionEmbed = undefined
            if(question.length == 2) {
                questionEmbed = new d.EmbedBuilder()
                    .setColor('#51e8ca')
                    .setTitle(question[0])
                    .setDescription("||" + question[1] + "||")
                    .setFooter({text: language(guild, 'NEW_QST')})
            } else if(question.length == 6) {
                questionEmbed = new d.EmbedBuilder()
                    .setColor('#51e8ca')
                    .setTitle(question[0])
                    .setDescription("1. " + question[1] + "\n2. " + question[2] + "\n3. " + question[3] +
                        "\n4. " + question[4] + language(guild, "ANSWER") + question[5] + "||")
                    .setFooter({text: language(guild, 'NEW_QST')})
            }

            // create the menu to select the theme
            const themeMenu = new d.StringSelectMenuBuilder()
                .setCustomId('questiontheme')
                .setPlaceholder(language(guild, 'THEME_SELECT'))
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(
                    new d.StringSelectMenuOptionBuilder()
                        .setLabel(language(guild, 'PHILOSOPHY'))
                        .setValue('philosophy'),
                )

            const row = new d.ActionRowBuilder()
                .addComponents(themeMenu)

            await interaction.editReply({ embeds: [questionEmbed], components: [row] })
        }
    });
}

module.exports.langTradResult = langTradResult