const { Logger, MongoClient } = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017/hackernews';
module.exports = async () => {
    const db = await MongoClient.connect(MONGO_URL);
    let count = 0;

    // Log all of the request to the MongoDB server
    Logger.setCurrentLogger((message, state) => {
        console.log(`MONGO DB REQUEST ${ ++count }: ${ message }`);
    });
    Logger.setLevel('debug');
    Logger.filter('class', ['Cursor']);

    return { 
        Links: db.collection('links'),
        Users: db.collection('users'),
        Votes: db.collection('votes'),
    };
};
