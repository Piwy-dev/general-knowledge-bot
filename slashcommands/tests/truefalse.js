const d = require('discord.js');

const profile = require('../../db/profile')
const language = require('../../language')

const truefalse = require('../../json/truefalse.json')

let has_answered = true;

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("trueorfalse")
        .setNameLocalizations({
            fr: "vraioufaux",
            nl: "waarofniet",
        })
        .setDescription("Gives a true or false question.")
        .setDescriptionLocalizations({
            fr: "Donne une question de vrai ou faux.",
            nl: "Geeft een waar of niet vraag.",
        }),

    async execute(interaction) {
        if (!has_answered) {
            await interaction.reply({
                content: `${language(guild, "PREVIOUS_QUESTION_NOT_ANSWERED")}`,
                ephemeral: true
            })
            return
        }

        has_answered = false;

        const { guild, user, member } = interaction

        const selectedLanguage = await language.guildLanguages[guild.id]

        await interaction.deferReply()

        // Get a random question
        var i = Math.floor(Math.random() * truefalse.questions.length)

        const trueFalseButton = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder()
                    .setCustomId('truefalse')
                    .setLabel(`${language(guild, "GIVE_ANSWER")}`)
                    .setStyle(d.ButtonStyle.Success)
            )

        await interaction.editReply({
            content: truefalse.questions[i][`qst_${selectedLanguage}`],
            components: [trueFalseButton],
        })

        // Get the Modal Submit Interaction that is emitted once the User submits the Modal
        const submitted = await interaction.awaitModalSubmit({
            // Timeout after 20s of not receiving any valid Modals
            time: 30000,
            // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
            filter: i => i.user.id === interaction.user.id,
            // Verify that the modal comes form the right test
            filter: i => i.customId === 'trueFalseModal',
        }).catch(error => {
            return null
        })

        // If user answer
        if (submitted) {
            has_answered = true;

            let answer = submitted.fields.getTextInputValue('trueFalseInput');
            answer = answer.toLowerCase()

            if (answer == "true" || answer == "vrai" || answer == "waar")
                answer = true

            else if (answer == "false" || answer == "faux" || answer == "niet waar")
                answer = false

            if (truefalse.questions[i]["answer"] === answer) {
                await interaction.editReply({
                    content: `${language(guild, "THX_ANSW")}`,
                    components: []
                })
                await submitted.reply(`${user} ${language(guild, "WIN_XP")} 5 points! ${truefalse.questions[i][`info_${selectedLanguage}`]}`)
                profile.addxp(guild.id, user.id, 5)
            }
            else {
                await interaction.editReply({
                    content: `${language(guild, "THX_ANSW")}`,
                    components: []
                })
                await submitted.reply(`${user} ${language(guild, "LOSE_XP")} 5 points. ${truefalse.questions[i][`info_${selectedLanguage}`]}`)
                profile.addxp(guild.id, user.id, -5)
            }
        }
        // If user doesn't answer
        else {
            has_answered = true;

            interaction.editReply({
                content: `${member}, ${language(guild, "QST_OUTDATED_1")} 3 ${language(guild, "QST_OUTDATED_2")} ${truefalse.questions[i]["answer"]}. \nInfo : ${truefalse.questions[i][`info_${selectedLanguage}`]}`,
                components: [],
            })

            profile.addxp(guild.id, member.id, -3)
        }
    }
}