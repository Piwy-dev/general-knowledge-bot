const d = require('discord.js')

const profile = require('../../db/profile')
const language = require('../../language')

const { flags } = require('../../json/flags.json');
const { contries } = require('../../json/contries.json');

const modules = require('../../modules.js')

let has_answered = true;

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("flags")
        .setNameLocalizations({
            fr: "drapeaux",
            nl: "vlaggen",
        })
        .setDescription("Test out your knowledge in flags")
        .setDescriptionLocalizations({
            fr: "Testez vos connaissances en drapeaux",
            nl: "Test uw kennis van vlaggen",
        }),

    async execute(interaction, client) {
        const { guild, member, channel } = interaction

        if (!has_answered) {
            await interaction.reply({
                content: `${language(guild, "HAS_ANSWERED")}`,
                ephemeral: true
            })
            return
        }

        has_answered = false;

        let i = Math.floor(Math.random() * Math.floor(flags.length));

        // Create the flag button
        const flagButton = new d.ActionRowBuilder()
            .addComponents(
                new d.ButtonBuilder()
                .setCustomId('flag')
                .setLabel(`${language(guild, "CONTRY_NAME")}`)
                .setStyle(d.ButtonStyle.Success)
            )

        // Reply to the interaction
        await interaction.reply({
            content: `${flags[i]}`,
            components: [flagButton],
        })

        // Get the Modal Submit Interaction that is emitted once the User submits the Modal
        const submitted = await interaction.awaitModalSubmit({
            // Timeout after 20s of not receiving any valid Modals
            time: 30000,
            // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
            filter: i => i.user.id === interaction.user.id,
            // Verify that the modal comes form the right test
            filter: i => i.customId === 'flagsModal',
        }).catch(error => {
            return null
        })
        
        // If user answer
        if (submitted) {
            has_answered = true;

            const flag = submitted.fields.getTextInputValue('flagsInput');

            let propositions = contries[i].split(", ");
            for (var prop = 0, p = propositions.length; p--;) {
                let similarity = modules.CompareStrings(propositions[p].toLocaleLowerCase(), flag.toLowerCase())
                // If an answer is correct
                if (similarity > 0.5) {
                    submitted.reply(`${member} ${language(guild, "WIN_XP")} 10 points!`);
                    interaction.editReply({
                        content: `${language(guild, "THX_ANSW")}`,
                        components: [],
                    })
                    profile.addxp(guild.id, member.id, 10)
                    break;
                }
                // If no answer is correct
                else if (similarity <= 0.5 && p == 0) {
                    submitted.reply(`${member} ${language(guild, "LOSE_XP")} 5 points ! ${language(guild, "ANSWER_WAS")} ${propositions[prop]}`);
                    interaction.editReply({
                        content: `${language(guild, "THX_ANSW")}`,
                        components: [],
                    })
                    profile.addxp(guild.id, member.id, -5)
                    break
                }
            }
        }
        // If user doesn't answer
        else {
            has_answered = true;
            
            interaction.editReply({
                content: `${member}, ${language(guild, "QST_OUTDATED_1")} 5 ${language(guild, "QST_OUTDATED_2")} ${contries[i].split(", ")[0]}`,
                components: [],
            })

            profile.addxp(guild.id, member.id, -3)
        }
    }
}
