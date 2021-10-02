const Discord = require('discord.js');
const path = require('path')
const fs = require('fs')
const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"]});

const {token} = require("./keys.json")

const mongo = require("./bdd/mongo");

// Liste des commandes
const vf = require('./commands/vf');
const capitals = require('./commands/capitals');
const profile = require('./bdd/profile')
const info = require('./commands/info');
const update = require('./commands/update');
const leaderboard = require('./commands/leaderboard');
const logo = require('./commands/logo');
const adminxp = require('./commands/adminxp');
const setlang = require('./commands/setlang');

const { loadLanguages } = require('./language')

// Laisse le bot en ligne
/*var http = require('http');  
http.createServer(function (req, res) {   
  res.write("I'm alive");   
  res.end(); 
}).listen(8080);*/

client.on('ready', async () =>{
    console.log(`Currently in ${client.guilds.cache.size} servers`);    
    
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

    await mongo().then(mongoose => { // Connecte à la base de données
        try {
            console.log('Base de donnée connectée');
        } finally{
            mongoose.connection.close();
        }
    })

    loadLanguages(client)

    /*command(client, 'bug', (message) => {
        client.guilds.cache.get('791608838209142796').channels.cache.get('811582706215288852').send(message.content.slice(4))
        message.reply('Bug repporter, merci')
    })

    /*command(client, ['adminxp'], async (message) => {  adminxp.adminxp(message)})
    command(client, ['setlang', 'setlanguage'], async (message) => {  setlang.setlang(message, arguments)})
    command(client, "update", message => { update.update(message, Discord)});
    command(client, ["info", "help"], message => { info.information(message, Discord)});

    leaderboard(client, Discord)
    vf(client)
    capitals(client)
    logo(client)*/

    client.user.setActivity("*help", {type: "WATCHING"})
});

client.login(token)