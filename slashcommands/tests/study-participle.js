const d = require('discord.js')

const modules = require('../../modules.js')

const verbsEn = require('../../json/verbs-english.json')
const verbsNl = require('../../json/verbs-dutch.json')

const language = require('../../language.js')

const profile = require('../../db/profile.js')

let has_answered = true;

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("study-participle")
        .setDescription("Study the past participle off a verb.")
        .setDescriptionLocalizations({
            fr: "Etudie le participe passé d'un verbe.",
            nl: "Leer het voltooid deelwoord van een werkwoord.",
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
        if (!has_answered) {
            await interaction.reply({
                content: `${language(guild, "PREVIOUS_QUESTION_NOT_ANSWERED")}`,
                flags: d.MessageFlags.Ephemeral
            })
            return
        }

        has_answered = false;

        const { guild, member, channel, options } = interaction

        await interaction.deferReply( { flags: d.MessageFlags.Ephemeral } );

        const selectLang = options.getString("language")

        // Charge la lange selectionnée
        let verbList = undefined

        switch (selectLang) {
            case "english", "engels", "anglais", "en":
                verbList = verbsEn
                break;
            case "dutch", "nederlands", "néerlandais", "nl":
                verbList = verbsNl
                break;
            default:
                interaction.reply({ content: "Unknown language !" })
                break;
        }

        // Si la langue est inconnue, on arrête le script
        if (verbList == undefined) return;

        // Choisi un nombre aléatoire entre 0 et la longueur de la liste
        const randomVerb = Math.floor(Math.random() * verbList.verbs.length)

        // Crée le bouton
        const partButton = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder()
                .setCustomId('participle')
                .setLabel(`${language(guild, "GIVE_ANSWER")}`)
                .setStyle(d.ButtonStyle.Success)
            )

        // Envoie le message de confirmation
        interaction.editReply({ content: `${language(guild, "CAN_ANSW")}`})

        // Envoie le message
        const message = await channel.send({ 
            content: `${language(guild, "VERB_ANSW").replace("{0}", "le participe passé").replace("{1}", verbList.verbs[randomVerb][0])}`,
            components: [partButton]
        })

        // Get the Modal Submit Interaction that is emitted once the User submits the Modal
        const submitted = await interaction.awaitModalSubmit({
            // Timeout after 30s of not receiving any valid Modals
            time: 30000,
            // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
            filter: i => i.user.id === interaction.user.id,
            // Verify that the modal comes form the right test
            filter: i => i.customId === 'partModal',
        }).catch(error => {
            return null
        })

        // If user answer
        if (submitted) {
            has_answered = true;

            const participle = submitted.fields.getTextInputValue('partInput');

            let similarity = modules.CompareStrings(verbList.verbs[randomVerb][2], participle.toLowerCase())
            
            // If answer is correct
            if (similarity >= 0.8) {
                submitted.reply(`${member} ${language(guild, "WIN_XP")} 4 points!`);
                message.edit({
                    content: `${language(guild, "THX_ANSW")}`,
                    components: [],
                })
                profile.addxp(guild.id, member.id, 4)
            }
            // If answer is incorrect
            else if (similarity < 0.8) {
                submitted.reply(`${member} ${language(guild, "LOSE_XP")} 3 points ! ${language(guild, "ANSWER_WAS")} ${verbList.verbs[randomVerb][2]}`);
                message.edit({
                    content: `${language(guild, "THX_ANSW")}`,
                    components: [],
                })
                profile.addxp(guild.id, member.id, -3)
            }
        }
        // If user doesn't answer
        else {
            has_answered = true; 

            message.edit({
                content: `${member}, ${language(guild, "QST_OUTDATED_1")} 3 ${language(guild, "QST_OUTDATED_2")} ${verbList.verbs[randomVerb][2]}`,
                components: [],
            })

            profile.addxp(guild.id, member.id, -5)
        } 
    }
}