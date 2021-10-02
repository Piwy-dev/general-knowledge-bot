const mongo = require('./mongo')
const profileSchema = require('./profile-schema')

const xpCache = {} // { 'guildId-userId': coins }

module.exports.addxp = async (guildId, userId, xp) => {
  return await mongo().then(async (mongoose) => {
    try {
      const result = await profileSchema.findOneAndUpdate(
        {
          guildId,
          userId,
        },
        {
          guildId,
          userId,
          $inc: {
            xp,
          },
        },
        {
          useFindAndModify: false,
          upsert: true,
          new: true,
        }
      )
      xpCache[`${guildId}-${userId}`] = result.xp

      return result.xp
    } finally {
      mongoose.connection.close()
    }
  })
}
