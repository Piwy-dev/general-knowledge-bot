const profile = require('../bdd/profile')
const language = require('../language')

const { questions } = require('../Json FILES/questions.json');
const { answers } = require('../Json FILES/answers.json');
const { informations } = require('../Json FILES/informations.json');

const { MessageActionRow, MessageButton, Permissions } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("truefalse")
        .setDescription("Gives a true or false question"),

    async execute(interaction, client) {
        const { guild, user } = interaction
        await interaction.deferReply()

        var i = Math.floor(Math.random() * Math.floor(questions.length));

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

        await interaction.editReply({
            content: questions[i],
            components: [buttons]
        });

        client.on('interactionCreate', async (interaction) => {
            const { user, message } = interaction

            if (!interaction.isButton()) return;

            if (interaction.customId === `true${i}`) {
                // Si quelqu'un d'autre essaye de répondre
                if (user !== target) return interaction.reply({
                    content: "Tu ne peux pas répondre à cette question effectue la comande toi-même pour pouvoir répondre.",
                    ephemeral: true
                })

                if (answers[i] === "vrai") {
                    await interaction.update({
                        content: "Merci d'avoir répondu.", // a traduire
                        components: []
                    })
                    await message.reply(`${user} ${language(guild, "WIN_XP")} 5 points! ${informations[i]}`)
                    profile.addxp(guild.id, user.id, 5)
                }
                else {
                    await interaction.update({
                        content: "Merci d'avoir répondu.",
                        components: []
                    })
                    await message.reply(`${user} ${language(guild, "LOSE_XP")} 5 points. ${informations[i]}`)
                    profile.addxp(guild.id, user.id, -5)
                }
            }
            else if (interaction.customId === `false${i}`) {
                // Si quelqu'un d'autre essaye de répondre
                if (user !== target) return interaction.reply({
                    content: "Tu ne peux pas répondre à cette question effectue la comande toi-même pour pouvoir répondre.",
                    ephemeral: true
                })

                if (answers[i] === "faux") {
                    await interaction.update({
                        content: "Merci d'avoir répondu.",
                        components: []
                    })
                    await message.reply(`${user} ${language(guild, "WIN_XP")} 5 points! ${informations[i]}`)
                    profile.addxp(guild.id, user.id, 5)
                }
                else {
                    await interaction.update({
                        content: "Merci d'avoir répondu.",
                        components: []
                    })
                    await message.reply(`${user} ${language(guild, "LOSE_XP")} 5 points. ${informations[i]}`)
                    profile.addxp(guild.id, user.id, -5)
                }
            }
            else return;
        })
    }
}