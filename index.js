const d = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config()

const client = new d.Client({ intents: [d.GatewayIntentBits.Guilds, d.GatewayIntentBits.GuildMessages, d.GatewayIntentBits.GuildMessageReactions, d.GatewayIntentBits.Guilds] });

const mongo = require("./db/mongo");

const { loadLanguages } = require('./language')

// Laisse le bot en ligne
var http = require('http');
http.createServer(function (req, res) {
    res.write("I'm alive");
    res.end();
}).listen(8080);


client.commands = new d.Collection();
const commandsPath = path.join(__dirname, 'slashcommands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const commands = [];
client.commands = new d.Collection();
for (const file of commandFiles) {
    const command = require(`./slashcommands/${file}`)
    commands.push(command.data.toJSON())
}

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

const rest = new d.REST({ version: '10' }).setToken(process.env.TEST_TOKEN);

(async () => {
	try {
		const data = await rest.put(
			d.Routes.applicationGuildCommands(process.env.TEST_CLIENT_ID, process.env.TEST_GUILD_ID),
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

    // Charge les commandes
    const rest = new d.REST({ version: '10' }).setToken(process.env.TEST_TOKEN);

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
    const sellect = require('./events/sellect')
    testAnswers(client)
    sellect(client)

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
    if (!interaction.isChatInputCommand()) return
    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) return console.log("Unkonwn command.")

    try {
        await command.execute(interaction, client)
    } catch (err) {
        console.error(err)
        await interaction.reply({
            content: `Error executing ${interaction.commandName}`,
            ephemeral: true
        })
    }
})

// Envoie un message quand le bot est ajouté un serveur
client.on(d.Events.GuildCreate, async guild => {
    // Trouve le channel
    const logChannel = client.guilds.cache.get('791608838209142796').channels.cache.get('943968391323066418')
    if (!logChannel) return console.log("Le channel de logs des nouveaux serveur n'existe pas.")

    // Crée l'embed
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

// Envoie un message quand le bot est retiré d'un serveur
client.on(d.Events.GuildDelete, async guild => {
    // Trouve le channel
    const logChannel = client.guilds.cache.get('791608838209142796').channels.cache.get('943968391323066418')
    if (!logChannel) return console.log("Le channel de logs des serveur n'existe pas.")

    // Essaye de trouver le propriétaire du serveur
    let guildOwner = 'Unknown'
    try {
        guildOwner = await guild.fetchOwner()
    } catch (err) {
        console.log("Impossible de trouver le propriétaire du serveur.")
    }

    // Crée l'embed
    const serverRemovedEmbed = new d.EmbedBuilder()
        .setTitle('Server removed !')
        .setColor("#fc0303")
        .setDescription("The bot was removed from the `" + `${guild.name}` + "` server. \n Server led by : `" + `${guildOwner.displayName}` + "`. They were **" + `${guild.memberCount}` + "** members on it.")
        .setFooter({ text: `The bot is now on ${client.guilds.cache.size} servers` })

    logChannel.send({
        embeds: [serverRemovedEmbed]
    })
})

client.login(process.env.TEST_TOKEN)