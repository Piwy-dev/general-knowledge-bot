const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const profileSchema = mongoose.Schema({
  guildId: reqString,
  userId: reqString,
  xp: {
    type: Number,
    defautl: 0
  },
})

module.exports = mongoose.model('profiles', profileSchema)