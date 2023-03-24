const profile = require('../db/profile')

const { logos } = require('../json/logo.json')

const language = require('../language')

const modules = require('../modules.js')

const d = require('discord.js')

let has_answered = true;

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("logo")
        .setDescription("Test out your knowledge in logos.")
        .setDescriptionLocalizations({
            fr: "Testez vos connaissances en logos.",
            nl: "Test uw kennis van logo's.",
        }),
       
    async execute(interaction, client) {
        const { guild, member, channel, options } = interaction

        if (!has_answered) {
            await interaction.reply({
                content: `${language(guild, "HAS_ANSWERED")}`,
                ephemeral: true
            })
            return
        }

        // Mark the answer as not answered
        has_answered = false;

        // Get a random logo
        let rd = 1 + Math.floor(Math.random() * 71);

        // Create the button
        const logoButton = new d.ActionRowBuilder()
        .addComponents(
            new d.ButtonBuilder()
            .setCustomId('logo')
            .setLabel(`${language(guild, "LOGO_BUTTON")}`)
            .setStyle(d.ButtonStyle.Success)
        )

        const attachement = new d.AttachmentBuilder(logos[rd]["image"])

        await interaction.reply({
            content: `${language(guild, "LOGO")}`,
            files: [attachement],
            components: [logoButton],
        })

        // Get the Modal Submit Interaction that is emitted once the User submits the Modal
        const submitted = await interaction.awaitModalSubmit({
            // Timeout after 20s of not receiving any valid Modals
            time: 25000,
            // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
            filter: i => i.user.id === interaction.user.id,
            // Verify that the modal comes form the right test
            filter: i => i.customId === 'logoModal',
        }).catch(error => {
            return null
        })

        // If user answer
        if (submitted) {
            has_answered = true;

            const logo = submitted.fields.getTextInputValue('logoInput');

            // Check the answer
            let similarity = modules.CompareStrings(logos[rd]["name"].toLowerCase(), logo.toLowerCase())

            // If an answer is correct
            if (similarity > 0.5) {
                submitted.reply(`${member} ${language(guild, "WIN_XP")} 2 points!`);
                interaction.editReply({
                    content: `${language(guild, "THX_ANSW")}`,
                    components: [],
                })
                profile.addxp(guild.id, member.id, 2)
            }
            // If no answer is coorect
            else if (similarity <= 0.5) {
                submitted.reply(`${member} ${language(guild, "LOSE_XP")} 3 points ! ${language(guild, "ANSWER_WAS")} ${logos[rd]["name"]}`);
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
                content: `${member}, ${language(guild, "QST_OUTDATED_1")} 5 ${language(guild, "QST_OUTDATED_2")} ${logos[rd]["name"]}`,
                components: [],
            })

            profile.addxp(guild.id, member.id, -5)
        }
    }
}