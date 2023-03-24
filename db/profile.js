const mongo = require('./mongo')
const profileSchema = require('./profile-schema')

const xpCache = {} // { 'guildId-userId': coins }

/**
 * Adds the specified amount of xp to the specified user's xp
 * @param {number} guildId - The guild's id
 * @param {number} userId - The user's id
 * @param {number} xp - The amount of xp to add
 * @returns {number} The new xp amount
 */
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
