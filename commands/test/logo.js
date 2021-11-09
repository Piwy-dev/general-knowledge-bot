const { MessageAttachment } = require("discord.js")

const profile = require('../../bdd/profile')
const language = require('../../language')

const {logos} = require('../../Json FILES/logos.json');
const {logosAnswers} = require('../../Json FILES/logosAnswers.json');

module.exports = {
    commands: ['logo'],
    callback: (message, arguments, text, client) => {
        const {guild} = message
        var i = Math.floor(Math.random() * Math.floor(logos.length));

        const attachement = new MessageAttachment(logos[i])
        message.reply({
            content: `${language(guild, "LOGO")}`, 
            files: [attachement]
        })
  
        const guildId = message.guild.id
        const userId = message.author.id
        const channel = message.channel
    
        var canAnswer = true
    
        client.on("messageCreate", msg => {
            if(msg.author !== message.author) return;  // Verifie que ce sois le bon auteur
            if(msg.author.id === "803979491373219840") return; // Verifie qeu ce ne sois pas le bot qui réponde
            if(!canAnswer) return
    
            function Compare(strA,strB){
                for(var result = 0, i = strA.length; i--;){
                    if(typeof strB[i] == 'undefined' || strA[i] == strB[i]);
                    else if(strA[i].toLowerCase() == strB[i].toLowerCase())
                        result++;
                    else
                        result += 4;
                }
                return 1 - (result + 4*Math.abs(strA.length - strB.length))/(2*(strA.length+strB.length));
            }
        
            var similarity = Compare(logosAnswers[i].toLowerCase(), msg.content.toLowerCase());
        
            if(similarity > 0.5){
                channel.send(`${message.author} ${language(guild, "WIN_XP")} 2 points!`);
                profile.addxp(guildId, userId, 2)
                canAnswer = false
            }
            else{
                channel.send(`${message.author} ${language(guild, "LOSE_XP")} 5 points! ${language(guild, "ANSWER_WAS")} ${logosAnswers[i]}`);
                profile.addxp(guildId, userId, -5)
                canAnswer = false
            }
        })
    },
  }
  