const language = require('../../language')
const profile = require('../../bdd/profile')

const {contries} = require('../../Json FILES/capContries.json');
const {capitals} = require('../../Json FILES/capitals.json');

module.exports = {
    commands: ['capital', 'c'],
    callback: (message, arguments, text, client) => {
        const {guild, channel} = message

        var i = Math.floor(Math.random() * Math.floor(contries.length));

        message.channel.send(`${message.author} ${language(guild, "CAPITAL")} ${contries[i]}?`);
    
        const guildId = message.guild.id
        const userId = message.author.id
    
        var canAnswer = true
    
        client.on("message", msg => {
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
        
            var similarity = Compare(capitals[i].toLowerCase() ,msg.content.toLowerCase());
        
            if(similarity > 0.5){
                channel.send(`${message.author} ${language(guild, "WIN_XP")} 10 points!`);
                profile.addxp(guildId, userId, 10)
                canAnswer = false
            }
            else{
                channel.send(`${message.author} ${language(guild, "LOSE_XP")} 5 points! ${language(guild, "ANSWER_WAS")} ${capitals[i]}`);
                profile.addxp(guildId, userId, -5)
                canAnswer = false
            }
        })
    },
  }
  