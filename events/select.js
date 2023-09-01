const d = require('discord.js');
const fs = require('fs')
const csv = require('jquery-csv')

const modules = require('../modules.js');
const { verbList } = require('../slashcommands/tests/study-infintive.js');

const mongo = require('../db/mongo')
const languageSchema = require('../db/language-schema');
const { language, setLanguage } = require('../language')

let langTradResult = undefined

let qst_philo = []
fs.readFile('./csv/qst_philo.csv', 'utf8', (err, data) => {
    if (err) return console.error(err)
    qst_philo = csv.toArrays(data)
})

let previousSubjects = undefined
let previousCards = undefined
const cards = require('../json/cards.json')

module.exports = (client) => {
    client.on(d.Events.InteractionCreate, async interaction => {

        const { guild, channel } = interaction

        // Verify if the interaction is a sellect menu
        if (!interaction.isStringSelectMenu()) return;

        await interaction.deferReply({ephemeral: true})

        if(interaction.customId === 'langTrad') {
            values = interaction.values[0]
            langTradResult = modules.SendVerbMessage(guild, channel, verbList, values)
        }

        else if(interaction.customId === 'questiontheme') {
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

        else if(interaction.customId === 'cardtheme') {
            // Get the selected theme
            const theme = interaction.values[0] 
            
            // Get the subjects of the theme
            let subjects = []
            switch(theme) {
                case 'algebra': subjects = cards.algebra;  break;
                case 'algorithmics': subjects = cards.algorithmics; break;
                case 'electronics': subjects = cards.electronics; break;
            }
            previousSubjects = subjects

            // Create a select menu with the subjects
            const subjectsMenu = new d.StringSelectMenuBuilder()
                .setCustomId('cardsubject')
                .setPlaceholder(language(guild, 'SUBJECTS_SELECT'))
                .setMinValues(1)
                .setMaxValues(1)


            // Transform the obejct into an array
            let subjectNames = Object.keys(subjects)

            subjectNames.forEach(subject => {
                subjectsMenu.addOptions(
                    new d.StringSelectMenuOptionBuilder()
                        .setLabel(subject)
                        .setValue(subject),
                )
            })

            const row = new d.ActionRowBuilder()
                .addComponents(subjectsMenu)

            
            const cardEmbed = new d.EmbedBuilder()
                .setColor('#51e8ca')
                .setTitle(language(guild, 'SUBJECTS'))
                .setDescription(language(guild, 'SUBJECTS_DESC'))


            await interaction.editReply({ embeds: [cardEmbed], components: [row] })
        }

        else if(interaction.customId === 'cardsubject') {
            // Get the selected subject
            const subject = interaction.values[0] 

            // Create a select menu with the cards
            const cardsMenu = new d.StringSelectMenuBuilder()
                .setCustomId('card')
                .setPlaceholder(language(guild, 'CARDS_SELECT'))
                .setMinValues(1)
                .setMaxValues(1)

            // Get the cards of the subject
            const cards = previousSubjects[subject]
            previousCards = cards
            let cardNames = Object.keys(cards)  

            cardNames.forEach(card => {
                cardsMenu.addOptions(
                    new d.StringSelectMenuOptionBuilder()
                        .setLabel(card)
                        .setValue(card),
                )
            })

            const row = new d.ActionRowBuilder()
                .addComponents(cardsMenu) 

            const cardEmbed = new d.EmbedBuilder()
                .setColor('#51e8ca')
                .setTitle(language(guild, 'CARDS'))
                .setDescription(language(guild, 'CARDS_DESC'))

            await interaction.editReply({ embeds: [cardEmbed], components: [row] })
        }

        else if(interaction.customId === 'card') {
            const selcetedCard = interaction.values[0]

            const card = previousCards[selcetedCard]

            // Convert the color to an integer
            card.color = parseInt(card.color)

            interaction.editReply({
                embeds: [card]
            })
        }

        else if(interaction.customId === 'language') {
            const targetLanguage = interaction.values[0]

            setLanguage(guild, targetLanguage)

            await mongo().then(async(mongoose) => {
                try {
                    await languageSchema.findOneAndUpdate({
                        _id: guild.id
                    }, {
                        _id: guild.id,
                        language: targetLanguage
                    }, {
                        upsert: true
                    })

                    interaction.editReply(`The language has been changed to ${targetLanguage}.`)

                } finally {
                    mongoose.connection.close()
                }
            })
        }
    });
}

module.exports.langTradResult = langTradResult