const language = require('../../language')
const guildLanguages = require('../../language').guildLanguages
const profile = require('../../db/profile')

const { contries } = require('../../json/contries.json');

const d = require('discord.js')

const modules = require('../../modules')

let has_answered = true;

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("capitals")
        .setNameLocalizations({
            fr: "capitales",
            nl: "hoofdsteden",
        })
        .setDescription("Test out your knowledge in capitals")
        .setDescriptionLocalizations({
            fr: "Testez vos connaissances en capitales",
            nl: "Test uw kennis van hoofdsteden",
        }), 

    async execute(interaction) {
        if (!has_answered) {
            await interaction.reply({
                content: `${language(guild, "PREVIOUS_QUESTION_NOT_ANSWERED")}`,
                flags: d.MessageFlags.Ephemeral
            })
            return
        }

        has_answered = false;

        const { guild, member } = interaction
        const lang = guildLanguages[guild.id]
       
        await interaction.deferReply({ ephemeral: true })

        let i = Math.floor(Math.random() * contries.length);

        while (contries[i]["capital"][lang] == null)
            i = Math.floor(Math.random() * contries.length);

        // Create the captitals button
        const capitalButton = new d.ActionRowBuilder()
        .addComponents(
            new d.ButtonBuilder()
            .setCustomId('capitals')
            .setLabel(`${language(guild, "CONTRY_NAME")}`)
            .setStyle(d.ButtonStyle.Success)
        )

        // Reply to the interaction
        await interaction.editReply({
            content: `${language(guild, "CAPITAL")} ${contries[i][lang]}`,
            components: [capitalButton],
        })

        // Get the Modal Submit Interaction that is emitted once the User submits the Modal
        const submitted = await interaction.awaitModalSubmit({
            // Timeout after 20s of not receiving any valid Modals
            time: 30000,
            // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
            filter: i => i.user.id === interaction.user.id,
            // Verify that the modal comes form the right test
            filter: i => i.customId === 'capitalsModal',
        }).catch(error => {
            return null
        })

        // If user answer
        if (submitted) {
            has_answered = true;

            const capital = submitted.fields.getTextInputValue('capitalsInput');

            let similarity = modules.CompareStrings(contries[i]["capital"][lang], capital.toLowerCase())
            // If answer is correct
            if (similarity > 0.5) {
                submitted.reply({
                    content: `${member} ${language(guild, "WIN_XP")} 8 points!`,
                    flags: d.MessageFlags.Ephemeral
                });
                interaction.editReply({
                    content: `${language(guild, "THX_ANSW")}`,
                    components: [],
                })
                profile.addxp(guild.id, member.id, 8)
            }
            // If answer is incorrect
            else if (similarity <= 0.5) {
                submitted.reply({
                    content: `${member} ${language(guild, "LOSE_XP")} 3 points ! ${language(guild, "ANSWER_WAS")} ${contries[i]["capital"][lang]}`,
                    flags: d.MessageFlags.Ephemeral
                });
                interaction.editReply({
                    content: `${language(guild, "THX_ANSW")}`,
                    components: [],
                })
                profile.addxp(guild.id, member.id, -3)
            }
        }
        // If user doesn't answer
        else {
            has_answered = true; 

            interaction.editReply({
                content: `${member}, ${language(guild, "QST_OUTDATED_1")} 3 ${language(guild, "QST_OUTDATED_2")} ${capitals[i]}`,
                components: [],
            })

            profile.addxp(guild.id, member.id, -3)
        } 
    }
}