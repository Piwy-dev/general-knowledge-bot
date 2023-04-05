const profile = require('../db/profile')
const language = require('../language')

const truefalse = require('../json/truefalse.json')

const { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
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

    async execute(interaction, client) {
        const { guild, user } = interaction

        await interaction.deferReply()

        var i = 1 + Math.floor(Math.random() * 57);

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder() // Création du bouton correct
                    .setCustomId(`true${i}`)
                    .setLabel(`${language(guild, "TRUE")}`) // ajouter la traduction
                    .setStyle('Success')
            )
            .addComponents(
                new ButtonBuilder() // Création du bouton incorrect
                    .setCustomId(`false${i}`)
                    .setLabel(`${language(guild, "FALSE")}`) // ajouter la traduction
                    .setStyle('Danger')
            )

        const target = user

        const selectedLanguage = await language.guildLanguages[guild.id]

        await interaction.editReply({
            content: truefalse.questions[i][`qst_${selectedLanguage}`],
            components: [buttons]
        });

        client.on('interactionCreate', async (interaction) => {
            const { user, message } = interaction

            if (!interaction.isButton()) return;

            if (interaction.customId === `true${i}`) {
                // Si quelqu'un d'autre essaye de répondre
                if (user !== target) return interaction.reply({
                    content: `${language(guild, "CANT_ANSW")}`,
                    ephemeral: true
                })

                if (truefalse.questions[i]["answer"] === "true") {
                    await interaction.update({
                        content: `${language(guild, "THX_ANSW")}`,
                        components: []
                    })
                    await message.reply(`${user} ${language(guild, "WIN_XP")} 5 points! ${truefalse.questions[i][`info_${selectedLanguage}`]}`)
                    profile.addxp(guild.id, user.id, 5)
                }
                else {
                    await interaction.update({
                        content: `${language(guild, "THX_ANSW")}`,
                        components: []
                    })
                    await message.reply(`${user} ${language(guild, "LOSE_XP")} 5 points. ${truefalse.questions[i][`info_${selectedLanguage}`]}`)
                    profile.addxp(guild.id, user.id, -5)
                }
            }
            else if (interaction.customId === `false${i}`) {
                // Si quelqu'un d'autre essaye de répondre
                if (user !== target) return interaction.reply({
                    content: `${language(guild, "CANT_ANSW")}`,
                    ephemeral: true
                })

                if (truefalse.questions[i]["answer"] === "false") {
                    await interaction.update({
                        content: `${language(guild, "THX_ANSW")}`,
                        components: []
                    })
                    await message.reply(`${user} ${language(guild, "WIN_XP")} 5 points! ${truefalse.questions[i][`info_${selectedLanguage}`]}`)
                    profile.addxp(guild.id, user.id, 5)
                }
                else {
                    await interaction.update({
                        content: `${language(guild, "THX_ANSW")}`,
                        components: []
                    })
                    await message.reply(`${user} ${language(guild, "LOSE_XP")} 5 points. ${truefalse.questions[i][`info_${selectedLanguage}`]}`)
                    profile.addxp(guild.id, user.id, -5)
                }
            }
            else return;
        })
    }
}