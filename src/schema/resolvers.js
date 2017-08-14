module.exports = {
    Query: {
        allLinks: async (root, data, context) => {
            const mongo = context.mongo;
            // We are accessing the Links collection in Mongo and converting the results into an array.      
            return await mongo.Links.find({}).toArray();
        },
    },
    Mutation: {
        createLink: async (root, data, { mongo: { Links }, user }) => {
            const newLink = Object.assign({author: user && user._id }, data);
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
        }
    },
    Link: { //This is a reference to the Link type, whenever a request the field is requested it will execute the following
        id: root => root._id || root.id,
        author: async ({ id }, data, { mongo: {Users}}) => {
            return await Users.findOne({_id: id});
        }
    },
    User: { //This is a reference to the Link type, whenever a request the field is requested it will execute the following
        id: root => root._id || root.id,
    },
};
