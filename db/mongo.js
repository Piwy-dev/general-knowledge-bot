const mongoose = require("mongoose");

module.exports = async() => {
    const mongo_user = encodeURIComponent(process.env.MONGO_USER);
    const mongo_password = encodeURIComponent(process.env.MONGO_PASSWORD);
    const cluster_name = "cluster0.rbdrg.mongodb.net";
    const mongo_db = process.env.MONGO_DB;
    const mongo_uri = `mongodb+srv://${mongo_user}:${mongo_password}@${cluster_name}/${mongo_db}?retryWrites=true&w=majority`;
    
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }

    await mongoose.connect(mongo_uri, options);
    return mongoose;
}