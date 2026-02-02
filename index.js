/** Packages **/
const d = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config()

/** Environment **/
const production = process.env.BOT_ENV === 'production';
if (production) {
    console.log("Bot is set in production mode !");
} else {
    console.log("Bot is set in test mode !");
}

/** Discord **/
const client = new d.Client({ intents: [d.GatewayIntentBits.Guilds, d.GatewayIntentBits.GuildMessages, d.GatewayIntentBits.GuildMessageReactions, d.GatewayIntentBits.Guilds] });
const { mainEmbed, testEmbed, irrverbsEmbed, studyEmbed, profileEmbed, configurationEmbed, inviteButtons } = require('./builders')

/** Database **/
const mongo = require("./db/mongo");

/** Language **/
const languageSchema = require('./db/language-schema');
const { loadLanguages, setLanguage } = require('./language')
const language = require('./language')

/** Slash commands **/
const commands = [];
client.commands = new d.Collection();
const foldersPath = path.join(__dirname, 'slashcommands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

// Construct and prepare an instance of the REST module
const token = process.env.BOT_ENV === 'production' ? process.env.PROD_TOKEN : process.env.TEST_TOKEN;
const rest = new d.REST({ version: '10' }).setToken(token);

// Deploy commands 
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            production ? d.Routes.applicationCommands(process.env.CLIENT_ID) : d.Routes.applicationCommands(process.env.TEST_CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();


client.once(d.Events.ClientReady, async () => {
    // Charge la langue du serveur
    await loadLanguages(client)

    // Connecte à la bdd
    await mongo().then(mongoose => {
        try {
            console.log('DB connected successfully');
        } finally {
            mongoose.connection.close();
        }
    })

    // Charge les events
    const testAnswers = require('./events/button')
    const select = require('./events/select')
    testAnswers(client)
    select(client)

    console.log(`Currently in ${client.guilds.cache.size} servers`);

    // Set the bot's presence
    client.user.setPresence({
        activities: [{
            name: `${client.guilds.cache.size} servers`,
            type: d.ActivityType.Watching
        }],
        status: 'online'
    });
});

client.on(d.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', flags: d.MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', flags: d.MessageFlags.Ephemeral });
        }
    }
});

client.on(d.Events.GuildCreate, async guild => {
    // By default sets the bot language to english
    setLanguage(guild, "english")
    await mongo().then(async (mongoose) => {
        try {
            await languageSchema.findOneAndUpdate({
                _id: guild.id
            }, {
                _id: guild.id,
                language: "english"
            }, {
                upsert: true
            })
        } finally {
            mongoose.connection.close()
        }
    })

    // Sends an infomation message when the bot is added to a server    
    // Find the first channel of the server
    const channel = guild.channels.cache.filter(channel => channel.type == d.ChannelType.GuildText).first()
    if (!channel) return console.log("Impossible de trouver le premier channel du serveur.")

    await channel.send({
        embeds: [mainEmbed(guild), testEmbed(guild), irrverbsEmbed(guild), studyEmbed(guild), profileEmbed(guild), configurationEmbed(guild)],
        components: [inviteButtons(guild)]
    })

    // Sends a log message when the bot is added to a server
    const logChannelId = production
    ? { guildId: '791608838209142796', channelId: '943968391323066418' }
    : { guildId: '784075037333520395', channelId: '1119649916617244832' };
    const logChannel = client.guilds.cache.get(logChannelId.guildId).channels.cache.get(logChannelId.channelId);
    if (!logChannel) return console.log("Le channel de logs des nouveaux serveur n'existe pas.")

    const guildOwner = await guild.fetchOwner()
    const newServerEmbed = new d.EmbedBuilder()
        .setTitle('New server !')
        .setColor("#03fc7b")
        .setDescription("The bot was added on the `" + `${guild.name}` + "` server. \n Server led by : `" + `${guildOwner.displayName}` + "`. They are **" + `${guild.memberCount}` + "** members on it.")
        .setFooter({ text: `The bot is now on ${client.guilds.cache.size} servers` })

    logChannel.send({
        embeds: [newServerEmbed]
    })
})

// Sends a message when the bot is removed from a server
client.on(d.Events.GuildDelete, async guild => {
     const logChannelId = production
     ? { guildId: '791608838209142796', channelId: '943968391323066418' }
     : { guildId: '784075037333520395', channelId: '1119649916617244832' };
     const logChannel = client.guilds.cache.get(logChannelId.guildId).channels.cache.get(logChannelId.channelId);
     if (!logChannel) return console.log("Le channel de logs des nouveaux serveur n'existe pas.")

    // Try finding the owner
    let guildOwner = 'Unknown'
    try {
        guildOwner = await guild.fetchOwner()
    } catch (err) {
        console.log("Impossible de trouver le propriétaire du serveur.")
    }

    // Create the embed
    const serverRemovedEmbed = new d.EmbedBuilder()
        .setTitle('Server removed !')
        .setColor("#fc0303")
        .setDescription("The bot was removed from the `" + `${guild.name}` + "` server. \n Server led by : `" + `${guildOwner.displayName}` + "`. They were **" + `${guild.memberCount}` + "** members on it.")
        .setFooter({ text: `The bot is now on ${client.guilds.cache.size} servers` })

    // Send the embed
    logChannel.send({
        embeds: [serverRemovedEmbed]
    })
})

client.login(token);