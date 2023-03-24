const language = require('../language')
const profile = require('../db/profile')

const { contries } = require('../json/capContries.json');
const { capitals } = require('../json/capitals.json');

const d = require('discord.js')

const modules = require('../modules')

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
        const { guild, member, channel } = interaction

        if (!has_answered) {
            await interaction.reply({
                content: `${language(guild, "HAS_ANSWERED")}`,
                ephemeral: true
            })
            return
        }

        has_answered = false;

        let i = Math.floor(Math.random() * Math.floor(contries.length));

        // Create the captitals button
        const capitalButton = new d.ActionRowBuilder()
        .addComponents(
            new d.ButtonBuilder()
            .setCustomId('capitals')
            .setLabel(`${language(guild, "CONTRY_NAME")}`)
            .setStyle(d.ButtonStyle.Success)
        )

        // Reply to the interaction
        await interaction.reply({
            content: `${language(guild, "CAPITAL")} ${contries[i]}`,
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

            let similarity = modules.CompareStrings(capitals[i].toLocaleLowerCase(), capital.toLowerCase())
            // If answer is correct
            if (similarity > 0.5) {
                submitted.reply(`${member} ${language(guild, "WIN_XP")} 8 points!`);
                interaction.editReply({
                    content: `${language(guild, "THX_ANSW")}`,
                    components: [],
                })
                profile.addxp(guild.id, member.id, 8)
            }
            // If answer is incorrect
            else if (similarity <= 0.5) {
                submitted.reply(`${member} ${language(guild, "LOSE_XP")} 5 points ! ${language(guild, "ANSWER_WAS")} ${capitals[i]}`);
                interaction.editReply({
                    content: `${language(guild, "THX_ANSW")}`,
                    components: [],
                })
                profile.addxp(guild.id, member.id, -5)
            }
        }
        // If user doesn't answer
        else {
            has_answered = true; 

            interaction.editReply({
                content: `${member}, ${language(guild, "QST_OUTDATED_1")} 5 ${language(guild, "QST_OUTDATED_2")} ${capitals[i]}`,
                components: [],
            })

            profile.addxp(guild.id, member.id, -5)
        } 
    }
}