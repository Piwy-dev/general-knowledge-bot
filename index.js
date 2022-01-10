const { Intents, Client, Collection } = require('discord.js')

const fs = require('fs')
require('dotenv').config()

const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")

const client = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]
});

const config = require("./keys.json")

const mongo = require("./bdd/mongo");

const { loadLanguages } = require('./language')

// Laisse le bot en ligne
var http = require('http');
http.createServer(function (req, res) {
    res.write("I'm alive");
    res.end();
}).listen(8080);

const commandFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'));
const commands = [];
client.commands = new Collection();
for (const file of commandFiles) {
    const command = require(`./slashcommands/${file}`)
    commands.push(command.data.toJSON())
    client.commands.set(command.data.name, command)
}

client.on('ready', async () => {

    // Charge la langue du serveur
    await loadLanguages(client)

    // Charge les commandes
    const clientID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(config.token);

    (async () => {
        await rest.put(Routes.applicationGuildCommands(clientID, config.GuildID), {
            body: commands
        })
        console.log("Les commandes ont été chargées localement correctement.")
    })()

    // Connecte à la bdd
    await mongo().then(mongoose => {
        try {
            console.log('Base de donnée connectée');
        } finally {
            mongoose.connection.close();
        }
    })

    console.log(`Currently in ${client.guilds.cache.size} servers`);
    client.user.setActivity(`Currently in ${client.guilds.cache.size} servers`, { type: "WATCHING" })
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) return

    try {
        await command.execute(interaction, client)
    }
    catch (err) {
        if (err) console.error(err)

        await interaction.reply({
            content: "An error occured while executing this command. Please try again or repport a bug.",
            ephemeral: true
        })
    }
})

client.login(config.token)