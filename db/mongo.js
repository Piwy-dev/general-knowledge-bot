const mongoose = require("mongoose");

module.exports = async() => {
    const mongo_user = encodeURIComponent(process.env.MONGO_USER);
    const mongo_password = encodeURIComponent(process.env.MONGO_PASSWORD);
    const mongo_db = process.env.MONGO_DB;
    const mongo_uri = `mongodb+srv://${mongo_user}:${mongo_password}@cluster0.rbdrg.mongodb.net/${mongo_db}?retryWrites=true&w=majority`;
    
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }

    await mongoose.connect(mongo_uri, options);
    return mongoose;
}