const profile = require('../../bdd/profile')
const language = require('../../language')

const {questions} = require('../../Json FILES/questions.json');
const {answers} = require('../../Json FILES/answers.json');
const {informations} = require('../../Json FILES/informations.json');

module.exports = {
    commands: ['vraifaux', 'vf', 'truefalse', 'tf'],
    callback: async (message, arguments, text, client) => {
        const {guild, channel} = message

        var i = Math.floor(Math.random() * Math.floor(questions.length));

        var msg = await message.channel.send(questions[i]);
        msg.react('✅')
        msg.react('❌')
    
        const guildId = message.guild.id
        const userId = message.author.id
    
        client.on('messageReactionAdd', async (reaction, user) => {
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            if(user.bot) return;
            if(reaction.message.guild !== msg.guild) return;
        
            if(reaction.message.channel === msg.channel && reaction.message === msg){
                if(user === message.author)
                {
                    if(reaction.emoji.name === '✅'){
                        
                        if(answers[i] === "vrai"){
                            profile.addxp(guildId, userId, 5)
                            channel.send(`${message.author} ${language(guild, "WIN_XP")} 5 points! ${informations[i]}`)
                            msg.delete().catch(e => {});
                        }
                        else{ 
                            profile.addxp(guildId, userId, -5)
                            channel.send(`${message.author} ${language(guild, "LOSE_XP")} 5 points. ${informations[i]}`)
                            msg.delete().catch(e => {});
                        }
                    }
                    else if(reaction.emoji.name === '❌'){
                        if(answers[i] === "faux"){
                            profile.addxp(guildId, userId, 5)
                            channel.send(`${message.author} ${language(guild, "WIN_XP")} 5 points! ${informations[i]}`)
                            msg.delete().catch(e => {});
                        }
                        else { 
                            profile.addxp(guildId, userId, -5)
                            channel.send(`${message.author} ${language(guild, "LOSE_XP")} 5 points. ${informations[i]}`)
                            msg.delete().catch(e => {});
                        }
                    }
                    else return message.reply("Le but d'un vrai ou faux, c'est qu'il n'y a que deux options possibles, en rajouter d'autres ne marchera pas.");
                }
                else return
            }
            else return
        });
    },
  }
  