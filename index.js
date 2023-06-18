const d = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config()

const client = new d.Client({ intents: [d.GatewayIntentBits.Guilds, d.GatewayIntentBits.GuildMessages, d.GatewayIntentBits.GuildMessageReactions, d.GatewayIntentBits.Guilds] });

const mongo = require("./db/mongo");

const { loadLanguages } = require('./language')

const language = require('./language')


const commands = [];
client.commands = new d.Collection();
// Grab all the command files from the commands directory you created earlier
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

/* Construct and prepare an instance of the REST module */
// Test
const rest = new d.REST({ version: '10' }).setToken(process.env.TEST_TOKEN);
// Production
//const rest = new d.REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
            // Test
			d.Routes.applicationGuildCommands(process.env.TEST_CLIENT_ID, process.env.GUILD_ID),
            // Production
            //d.Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();


client.once(d.Events.ClientReady, async () => {
    // Charge la langue du serveur
    await loadLanguages(client)

    // Connecte à la bdd
    await mongo().then(mongoose => {
        try {
            console.log('Base de donnée connectée');
        } finally {
            mongoose.connection.close();
        }
    })

    // Charge les events
    const testAnswers = require('./events/testAnswers')
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
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on(d.Events.GuildCreate, async guild => {
    // Sends an infomation message when the bot is added to a server    
    // Find the first channel of the server
    const channel = guild.channels.cache.filter(channel => channel.type == d.ChannelType.GuildText).first()
    if (!channel) return console.log("Impossible de trouver le premier channel du serveur.")

    const inviteEmbed = new d.EmbedBuilder()
            .setColor('#3B5998')
            .setTitle(`${language(guild, "INVITE_TITLE")}`)
            .setDescription(`${language(guild, "INVITE_DESCR")}`)

    const testEmbed = new d.EmbedBuilder()
        .setColor('#61cdff')
        .setTitle(`${language(guild, "TEST_CMD")}`)
        .setDescription(`${language(guild, "TEST_CMD_DESCR")}`)
        .addFields({
            name: `${language(guild, "TRUE_FALSE")}`,
            value: `${language(guild, "TRUE_FALSE_DESCR")}`
        }, {
            name: `${language(guild, "FLAG_TEST")}`,
            value: `${language(guild, "FLAG_TEST_DESCR")}`
        }, {
            name: `${language(guild, "CAPITAL_TEST")}`,
            value: `${language(guild, "CAPITAL_TEST_DESCR")}`
        }, {
            name: `${language(guild, "LOGO_TEST")}`,
            value: `${language(guild, "LOGO_TEST_DESCR")}`
        });

    const irrverbsEmbed = new d.EmbedBuilder()
        .setColor('#69c280')
        .setTitle(`${language(guild, "IRREGUAR_VERBS_CMD")}`)
        .addFields({
            name: `${language(guild, "VERBS_LIST")}`,
            value: `${language(guild, "VERBS_LIST_DESCR")}`
        }, {
            name: `${language(guild, "STUDY_INF")}`,
            value: `${language(guild, "STUDY_INF_DESCR")}`
        }, {
            name: `${language(guild, "STUDY_IMPERF")}`,
            value: `${language(guild, "STUDY_IMPERF_DESCR")}`
        }, {
            name: `${language(guild, "STUDY_PAST_PART")}`,
            value: `${language(guild, "STUDY_PAST_PART_DESCR")}`
        });

    const profileEmbed = new d.EmbedBuilder()
        .setColor('#ff6b61')
        .setTitle(`${language(guild, "POINT_CMD")}`)
        .setDescription(`${language(guild, "POINT_CMD_DESCR")}`)
        .addFields({ name: `${language(guild, "PROFILE_CMD")}`, value: `${language(guild, "PROFILE_CMD_DESCR")}` }, { name: `${language(guild, "LEAD_CMD")}`, value: `${language(guild, "LEAD_CMD_DESCR")}` }, { name: `${language(guild, "ADMINXP_CMD")}`, value: `${language(guild, "ADMINXP_CMD_DESCR")}` });

    const configurationEmbed = new d.EmbedBuilder()
        .setColor('#9861ff')
        .setTitle(`${language(guild, "CONFIG_CMD")}`)
        .setDescription(`${language(guild, "CONFIG_CMD_DESCR")}`)
        .addFields({
            name: `${language(guild, "SETLANG_CMD")}`,
            value: `${language(guild, "SETLANG_DESCR")}`
        })
        .setFooter({text: `${language(guild, "INVITE_FOOTER")}`});

    const invitesButton = new d.ActionRowBuilder()
        .addComponents(
            new d.ButtonBuilder()
                .setLabel('Join support server')
                .setStyle(d.ButtonStyle.Link)
                .setURL('https://discord.gg/PhCdM465np')
        );

    
    // Send the embed
    await channel.send({ embeds: [inviteEmbed, testEmbed, irrverbsEmbed, profileEmbed, configurationEmbed], components: [invitesButton] })

    // Sends a log message when the bot is added to a server
    // Find the log channel
    const logChannel = client.guilds.cache.get('784075037333520395').channels.cache.get('1119649916617244832') // Test
    //const logChannel = client.guilds.cache.get('791608838209142796').channels.cache.get('943968391323066418') // Production
    if (!logChannel) return console.log("Le channel de logs des nouveaux serveur n'existe pas.")

    // Create the embed
    const guildOwner = await guild.fetchOwner()
    const newServerEmbed = new d.EmbedBuilder()
        .setTitle('New server !')
        .setColor("#03fc7b")
        .setDescription("The bot was added on the `" + `${guild.name}` + "` server. \n Server led by : `" + `${guildOwner.displayName}` + "`. They are **" + `${guild.memberCount}` + "** members on it.")
        .setFooter({ text: `The bot is now on ${client.guilds.cache.size} servers` })

    // Send the embed
    logChannel.send({
        embeds: [newServerEmbed]
    })
})

// Sends a message when the bot is removed from a server
client.on(d.Events.GuildDelete, async guild => {
    // Try finding the channel
    const logChannel = client.guilds.cache.get('784075037333520395').channels.cache.get('1119649916617244832') // Test
    //const logChannel = client.guilds.cache.get('791608838209142796').channels.cache.get('943968391323066418') // Production
    if (!logChannel) return console.log("Le channel de logs des serveur n'existe pas.")

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

// Test
client.login(process.env.TEST_TOKEN)
// Production
//client.login(process.env.TOKEN)