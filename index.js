const Discord = require('discord.js');
const { Intents } = require('discord.js')

const path = require('path')
const fs = require('fs')

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] },
    { partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"] });

const {token} = require("./keys.json")

const mongo = require("./bdd/mongo");

const { loadLanguages } = require('./language')

// Laisse le bot en ligne
var http = require('http');  
http.createServer(function (req, res) {   
  res.write("I'm alive");   
  res.end(); 
}).listen(8080);

client.on('ready', async () =>{
    console.log(`Currently in ${client.guilds.cache.size} servers`);    
    
    // Charge toutes les commandes
    const baseFile = 'command-base.js'
    const commandBase = require(`./commands/${baseFile}`)
    const readCommands = dir => {
        const files = fs.readdirSync(path.join(__dirname, dir))
        for(const file of files){
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()) {
                readCommands(path.join(dir, file))
            } else if (file !== baseFile) {
                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option)
            }
        }
    }
    readCommands('commands')

    // Connecte à la bdd
    await mongo().then(mongoose => { 
        try {
            console.log('Base de donnée connectée');
        } finally{
            mongoose.connection.close();
        }
    })

    // Charge la langue du serveur
    loadLanguages(client)

    client.user.setActivity(`Currently in ${client.guilds.cache.size} servers`, {type: "WATCHING"})
});

client.login(token)