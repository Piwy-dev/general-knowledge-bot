const d = require('discord.js')

const modules = require('../modules.js')

const verbsEn = require('../json/verbs-english.json')
const verbsNl = require('../json/verbs-dutch.json')

const language = require('../language.js')

const profile = require('../db/profile.js')

let verbList = undefined

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("study-infinitive")
        .setNameLocalizations({
            fr: "étudier-infinitif",
            nl: "studie-infinitief",
        })
        .setDescription("Study the past infinitive form off an irregual verb.")
        .setDescriptionLocalizations({
            fr: "Etudie l'infinitif d'un verbe irrégulier.",
            nl: "Leer het infinitief vorm van een werkwoord.",
        })
        .addStringOption((option) => option
            .setName("language")
            .setNameLocalizations({
                fr: "langue",
                nl: "taal",
            })
            .setDescription("The language of the verb [en, nl].")
            .setDescriptionLocalizations({
                fr: "La langue du verbe [en, nl].",
                nl: "De taal van het werkwoord [en, nl].",
            })
            .setRequired(true)
        ),

    async execute(interaction) {
        const { guild, member, options } = interaction

        await interaction.deferReply( { ephemeral: true } );

        const selectLang = options.getString("language")

        // Charge la lange selectionnée
        let lang = undefined

        switch (selectLang) {
            case "english", "engels", "anglais", "en":
                verbList = verbsEn
                lang = `${language(guild, "ENGLISH")}`
                break;
            case "dutch", "nederlands", "néerlandais", "nl":
                verbList = verbsNl
                lang = `${language(guild, "DUTCH")}`
                break;
            default:
                interaction.reply({ content: "Unknown language !" })
                break;
        }

        // Si la langue est inconnue, on arrête le script
        if (verbList == undefined) return;

        // choisi la langue dans laquelle il va traduire
        const chooseLang = new d.ActionRowBuilder()
            .addComponents(
                new d.SelectMenuBuilder()
                .setCustomId('langTrad')
                .setPlaceholder('Select a language')
                .addOptions([
                    {
                        label: lang, // La langue selectionnée
                        value: lang.toLowerCase(),
                    },
                    {
                        label: `${language(guild, "FRENCH")}}`,
                        value: 'french',
                    },
                ]),
            );

        // Envoie le message pour choisir la langue de traduction
        await interaction.editReply({ 
            content: `${language(guild, "LANGTRAD")}`.replace("{0}", lang).replace("{1}", `${language(guild, "FRENCH")}`), 
            components: [chooseLang] 
        })

        // Get the Modal Submit Interaction that is emitted once the User submits the Modal
        const submitted = await interaction.awaitModalSubmit({
            // Timeout after 30s of not receiving any valid Modals
            time: 30000,
            // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
            filter: i => i.user.id === interaction.user.id,
            // Verify that the modal comes form the right test
            filter: i => i.customId === 'infModal',
        }).catch(error => {
            return null
        })

        // If user answer
        if (submitted) {
            has_answered = true;

            const { langTradResult } = require('../events/sellect.js')

            // Get the value of the select menu
            let lan = 0
            if (langTradResult[1] == 0) 
                lan = 3
            else if (langTradResult[1] == 3)
                lan = 0

            const infinitive = submitted.fields.getTextInputValue('infInput');

            let similarity = modules.CompareStrings(verbList.verbs[randomVerb][lan], infinitive.toLowerCase())
            
            // If answer is correct
            if (similarity >= 0.8) {
                submitted.reply(`${member} ${language(guild, "WIN_XP")} 4 points!`);
                langTradResult[0].edit({
                    content: `${language(guild, "THX_ANSW")}`,
                    components: [],
                })
                profile.addxp(guild.id, member.id, 4)
            }
            // If answer is incorrect
            else if (similarity < 0.8) {
                submitted.reply(`${member} ${language(guild, "LOSE_XP")} 3 points ! ${language(guild, "ANSWER_WAS")} ${verbList.verbs[randomVerb][lan]}`);
                langTradResult[0].edit({
                    content: `${language(guild, "THX_ANSW")}`,
                    components: [],
                })
                profile.addxp(guild.id, member.id, -3)
            }
        }
        // If user doesn't answer
        else {
            has_answered = true; 

            langTradResult[0].edit({
                content: `${member}, ${language(guild, "QST_OUTDATED_1")} 3 ${language(guild, "QST_OUTDATED_2")} ${verbList.verbs[randomVerb][langTradResult[1]]}`,
                components: [],
            })

            profile.addxp(guild.id, member.id, -5)
        } 
    }
}

module.exports.verbList = verbList