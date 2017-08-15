const { ObjectID } = require('mongodb');

module.exports = {
    Query: {
        allLinks: async (root, data, { mongo: { Links } }) => {
            // We are accessing the Links collection in Mongo and converting the results into an array.      
            return await Links.find({}).toArray();
        },
        allUsers: async (root, data, { mongo: { Users } }) => {
            return await Users.find({}).toArray();
        }
    },
    Mutation: {
        createLink: async (root, data, { mongo: { Links }, user }) => {
            const newLink = Object.assign({ authorId: user && user._id }, data);
            const response = await Links.insert(newLink);
            return Object.assign({ id: response.insertedIds[0] }, newLink);
        },
        createUser: async (root, data, { mongo: { Users } }) => {
            const newUser = {
                name: data.name,
                email: data.authProvider.email.email,
                password: data.authProvider.email.password,
            };
            const response = await Users.insert(newUser);
            return Object.assign({ id: response.insertedIds[0] }, newUser);
        },
        signinUser: async (root, data, { mongo: { Users } }) => {
            const user = await Users.findOne({ email: data.email.email });

            if (data.email.password === user.password) {
                return { token: `token-${user.email}`, user };
            }
        },
        createVote: async (root, { linkId }, { mongo: { Votes }, user }) => {
            const vote = {
                userId: user && user._id,
                linkId: new ObjectID(linkId),
            };
            const response = await Votes.insert(vote);
            return Object.assign({ id: response.insertedIds[0] }, vote);
        },
    },
    Link: { //This is a reference to the Link type, whenever a request the field is requested it will execute the following
        id: root => root._id || root.id,
        author: async ({ authorId }, data, { mongo: { Users }, dataloaders: { userLoader } }) => {
            // return await Users.findOne({ _id: authorId });
            if (authorId) {
                return await userLoader.load(authorId);
            }
        },
        votes: async ({ _id }, data, { mongo: { Votes } }) => {
            return await Votes.find({ linkId: _id }).toArray();
        },
    },
    User: { //This is a reference to the Link type, whenever a request the field is requested it will execute the following
        id: root => root._id || root.id,
    },
    Vote: {
        id: root => root._id || root.id,
        user: async ({ userId }, data, { mongo: { Users }, dataloaders: { userLoader } }) => {
            if (userId) {
                return await userLoader.load(userId);
            }
        },
        link: async ({ linkId }, data, { mongo: { Links } }) => {
            return await Links.findOne({ _id: linkId });
        },
    },
};
