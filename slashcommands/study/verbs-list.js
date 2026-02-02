const d = require('discord.js');

const verbsEn = require('../../json/verbs-english.json')
const verbsNl = require('../../json/verbs-dutch.json')

module.exports = {
    data: new d.SlashCommandBuilder()
        .setName("verbs-list")
        .setDescription("Shows all the verbs in the list.")
        .setDescriptionLocalizations({
            fr: "Montre tous les verbes de la liste.",
            nl: "Toont alle werkwoorden in de lijst.",
        })
        .addStringOption((option) => option
            .setName("language")
            .setNameLocalizations({
                fr: "langue",
                nl: "taal",
            })
            .setDescription("The language that will be shown.")
            .setDescriptionLocalizations({
                fr: "La langue qui sera affichée.",
                nl: "De taal die wordt weergegeven.",
            })
            .setRequired(true)
        )
        .addBooleanOption((option) => option
            .setName("showtrad")
            .setNameLocalizations({
                fr: "affichertrad",
                nl: "toonvertaling",
            })
            .setDescription("If true : shows the verb and its traduction. If false : sows the verb and its past conjugaison.")
            .setDescriptionLocalizations({
                fr: "Si vrai : montre le verbe et sa traduction. Si faux : montre le verbe et sa conjugaison au passé.",
                nl: "Als waar : toont het werkwoord en zijn vertaling.",
            })
            .setRequired(true)
        ),
    async execute(interaction) {
        const { options } = interaction

        const selectLang = options.getString("language")
        const showTrad = options.getBoolean("showtrad")

        // Charge la lange selectionnée
        let verbList;
        let langIsSelected;
        let intCorrector;

        switch (selectLang) {
            case "english", "engels", "anglais", "en":
                verbList = verbsEn
                langIsSelected = true;
                intCorrector = 0;
                break;
            case "dutch", "nederlands", "néerlandais", "nl":
                verbList = verbsNl
                langIsSelected = true;
                intCorrector = 0.5;
                break;
            default:
                interaction.reply({
                    content: "Unknown language !",
                    flags: d.MessageFlags.Ephemeral
                })
                langIsSelected = false;
                break;
        }

        // Si on veut voir la conjugaison
        if (!showTrad && langIsSelected) {
            const verbsLenght = verbList.verbs.length

            infinitifs_1 = "";
            for (let v = 0; v < verbsLenght / 2 - intCorrector; v++) {
                infinitifs_1 += `\n${verbList.verbs[v][0]}`;
            }

            infinitifs_2 = "";
            for (let v = verbsLenght / 2 - intCorrector; v < verbsLenght; v++) {
                infinitifs_2 += `\n${verbList.verbs[v][0]}`;
            }

            imaparfait_1 = "";
            for (let v = 0; v < verbsLenght / 2 - intCorrector; v++) {
                imaparfait_1 += `\n${verbList.verbs[v][1]}`;
            }

            imaparfait_2 = "";
            for (let v = verbsLenght / 2 - intCorrector; v < verbsLenght; v++) {
                imaparfait_2 += `\n${verbList.verbs[v][1]}`;
            }

            partpas_1 = "";
            for (let v = 0; v < verbsLenght / 2 - intCorrector; v++) {
                partpas_1 += `\n${verbList.verbs[v][2]}`;
            }

            partpas_2 = "";
            for (let v = verbsLenght / 2 - intCorrector; v < verbsLenght; v++) {
                partpas_2 += `\n${verbList.verbs[v][2]}`;
            }

            const listEmbed_1 = new d.EmbedBuilder()
                .setColor("BLURPLE")
                .setTitle(`Liste des verbes irréguliers - ${selectLang}`)
                .addFields({ name: "Infinitif", value: `${infinitifs_1}`, inline: true }, { name: "Imparfait", value: `${imaparfait_1}`, inline: true }, { name: "Participe Passé", value: `${partpas_1}`, inline: true }, )

            const listEmbed_2 = new d.EmbedBuilder()
                .setColor("BLURPLE")
                .setTitle(`Liste des verbes irréguliers - ${selectLang}`)
                .addFields({ name: "Infinitif", value: `${infinitifs_2}`, inline: true }, { name: "Imparfait", value: `${imaparfait_2}`, inline: true }, { name: "Participe Passé", value: `${partpas_2}`, inline: true }, )

            interaction.reply({
                embeds: [listEmbed_1, listEmbed_2]
            })
        }
        // Si on veut voir les traduction
        else if (showTrad && langIsSelected) {
            const verbsLenght = verbList.verbs.length

            infinitifs_1 = "";
            for (let v = 0; v < verbsLenght / 2 - intCorrector; v++) {
                infinitifs_1 += `\n${verbList.verbs[v][0]}`;
            }

            infinitifs_2 = "";
            for (let v = verbsLenght / 2 - intCorrector; v < verbsLenght; v++) {
                infinitifs_2 += `\n${verbList.verbs[v][0]}`;
            }

            traductions_1 = "";
            for (let v = 0; v < verbsLenght / 2 - intCorrector; v++) {
                traductions_1 += `\n${verbList.verbs[v][3]}`;
            }

            traductions_2 = "";
            for (let v = verbsLenght / 2 - intCorrector; v < verbsLenght; v++) {
                traductions_2 += `\n${verbList.verbs[v][3]}`;
            }

            const infEmbed_1 = new d.EmbedBuilder()
                .setColor("BLURPLE")
                .setTitle(`Liste des verbes irréguliers - ${selectLang}`)
                .addFields({ name: "Infinitif", value: `${infinitifs_1}`, inline: true }, { name: "Traduction", value: `${traductions_1}`, inline: true }, )

            const infEmbed_2 = new d.EmbedBuilder()
                .setColor("BLURPLE")
                .addFields({ name: "Infinitif", value: `${infinitifs_2}`, inline: true }, { name: "Traduction", value: `${traductions_2}`, inline: true }, )

            interaction.reply({
                embeds: [infEmbed_1, infEmbed_2]
            })
        }
    }
}