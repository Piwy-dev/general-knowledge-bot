const d = require('discord.js');
const language = require('../language')

module.exports = (client) => {
    client.on(d.Events.InteractionCreate, async interaction => {

        const { guild } = interaction

        if(!interaction.isButton()) return;

        /* FLAG BUTTON */
        if(interaction.customId === 'flag') {
            // Create the flag modal
            const flagModal = new d.ModalBuilder()
            .setCustomId('flagsModal')
            .setTitle(`Flag test`)

            const flagsInput = new d.TextInputBuilder()
                .setCustomId('flagsInput')
                .setLabel(`${language(guild, "CONTRY_NAME")}`)
                .setStyle(d.TextInputStyle.Short);

            const flagActionRow = new d.ActionRowBuilder().addComponents(flagsInput);

            flagModal.addComponents(flagActionRow);

            await interaction.showModal(flagModal);
        }

        /* TRUE OR FALSE BUTTON */
        else if(interaction.customId === 'truefalse') {
            // Create the true or false modal
            const trueFalseModal = new d.ModalBuilder()
            .setCustomId('trueFalseModal')
            .setTitle(`${language(guild, "TRUE_FALSE_TITLE")}`)

            const trueFalseInput = new d.TextInputBuilder()
                .setCustomId('trueFalseInput')
                .setLabel(`${language(guild, "TRUE_FALSE_ANSWER")}`)
                .setStyle(d.TextInputStyle.Short);

            const trueFalseActionRow = new d.ActionRowBuilder().addComponents(trueFalseInput);

            trueFalseModal.addComponents(trueFalseActionRow);

            await interaction.showModal(trueFalseModal);
        }

        /* LOGO BUTTON */
        else if(interaction.customId === 'logo') {
            // Create the logo modal
            const logoModal = new d.ModalBuilder()
            .setCustomId('logoModal')
            .setTitle(`Logo test`)

            const logoInput = new d.TextInputBuilder()
                .setCustomId('logoInput')
                .setLabel(`${language(guild, "LOGO_BUTTON")} :`)
                .setStyle(d.TextInputStyle.Short);

            const logoActionRow = new d.ActionRowBuilder().addComponents(logoInput);

            logoModal.addComponents(logoActionRow);
            await interaction.showModal(logoModal);
        }

        /* CAPITALS BUTTONS */
        else if(interaction.customId === 'capitals') {
            // Create the capitals modal
            const capitalsModal = new d.ModalBuilder()
            .setCustomId('capitalsModal')
            .setTitle(`Capitals test`)

            const capitalsInput = new d.TextInputBuilder()
                .setCustomId('capitalsInput')
                .setLabel(`${language(guild, "CONTRY_NAME")} :`)
                .setStyle(d.TextInputStyle.Short);

            const capitalsActionRow = new d.ActionRowBuilder().addComponents(capitalsInput);

            capitalsModal.addComponents(capitalsActionRow);
            await interaction.showModal(capitalsModal);
        }

        /* PARTICIPLE BUTTON */
        else if(interaction.customId === 'participle') {
            // Create the participle modal
            const partModal = new d.ModalBuilder()
            .setCustomId('partModal')
            .setTitle(`Past partciple test`)

            const partInput = new d.TextInputBuilder()
            .setCustomId('partInput')
            .setLabel(`${language(guild, "PARTICIPLE")} :`)
            .setStyle(d.TextInputStyle.Short);

            const partActionRow = new d.ActionRowBuilder().addComponents(partInput);

            partModal.addComponents(partActionRow);
            await interaction.showModal(partModal);
        }
        
        /* IMPERFECT BUTTON */
        else if(interaction.customId === 'imperfect') {
            // Create the imperfect modal
            const impfModal = new d.ModalBuilder()
            .setCustomId('impfModal')
            .setTitle(`Imperfect test`)

            const impfInput = new d.TextInputBuilder()
            .setCustomId('impfInput')
            .setLabel(`${language(guild, "IMPERFECT")} :`)
            .setStyle(d.TextInputStyle.Short);

            const impfActionRow = new d.ActionRowBuilder().addComponents(impfInput);

            impfModal.addComponents(impfActionRow);
            await interaction.showModal(impfModal);
        }

        /* INFINITIVE BUTTON */
        else if(interaction.customId === 'infButton') {
            // Create the infinitive modal
            const infModal = new d.ModalBuilder()
            .setCustomId('impfModal')
            .setTitle(`Imperfect test`)

            const infInput = new d.TextInputBuilder()
            .setCustomId('impfInput')
            .setLabel(`${language(guild, "IMPERFECT")} :`)
            .setStyle(d.TextInputStyle.Short);

            const infActionRow = new d.ActionRowBuilder().addComponents(infInput);

            infModal.addComponents(infActionRow);
            await interaction.showModal(infModal);
        }
    });
}