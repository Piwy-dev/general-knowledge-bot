module.exports = {
    commands: ['update'],
    expectedArgs: '<num1> <num2>',
    minArgs: 2,
    maxArgs: 2,
    callback: (message, arguments, text) => {
        if(message.author.id !== '523447196050522123') return message.reply('Désolé, seulement le créateur du bot peut utiliser ceci')

        const newEmbed = new Discord.MessageEmbed()
        .setColor('#3B5998')
        .setTitle('Mise a jour terminée')
        .setDescription("Modifications: \n - Ajout de la feature des logos \n - Ajout de la commande adminxp")
        .setFooter('Version: 0.11 / Mis à jour par Piwy le 16/04/21');
    
        message.channel.send(newEmbed);
        message.delete().catch(e => {})
    },
  }
  