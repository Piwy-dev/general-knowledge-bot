const profile = require('../bdd/profile')
const language = require('../language')

const truefalse = require('../Json FILES/truefalse.json')

const { MessageActionRow, MessageButton, Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("truefalse")
        .setDescription("Gives a true or false question"),

    async execute(interaction, client) {
        const { guild, user } = interaction

        await interaction.deferReply()

        var i = 1 + Math.floor(Math.random() * 57);

        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton() // Création du bouton correct
                    .setCustomId(`true${i}`)
                    .setLabel(`${language(guild, "TRUE")}`) // ajouter la traduction
                    .setStyle('SUCCESS')
            )
            .addComponents(
                new MessageButton() // Création du bouton incorrect
                    .setCustomId(`false${i}`)
                    .setLabel(`${language(guild, "FALSE")}`) // ajouter la traduction
                    .setStyle('DANGER')
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