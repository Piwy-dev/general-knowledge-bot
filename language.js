const mongo = require('./db/mongo')
const languageSchema = require('./db/language-schema')
const lang = require('./lang.json')

const guildLanguages = {}

/**
* Loads the language for each guild form the database
* @param {Discord.Client} client
*/    
const loadLanguages = async (client) => {
    await mongo().then( async (mongoose) => {
        try {
            for(const guild of client.guilds.cache){
                const guildId = guild[0]

                const result = await languageSchema.findOne({
                    _id: guildId
                })

                guildLanguages[guildId] = result ? result : "english"
            }
        } finally {
            mongoose.connection.close()
        }
    })
}

/**
* Changes the language for a guild
* @param {Discord.Guild} guild
* @param {string} language
*/ 
const setLanguage = (guild, language) => {
    guildLanguages[guild.id] = language.toLowerCase()
}

module.exports = (guild, textId) => {
    if(!lang.translations[textId]){
        throw new Error (`Unknown textId: "${textId}"`)
    }

    const selectedLanguage = guildLanguages[guild.id];

    return lang.translations[textId][selectedLanguage]
}
module.exports.loadLanguages = loadLanguages
module.exports.setLanguage = setLanguage
module.exports.guildLanguages = guildLanguages