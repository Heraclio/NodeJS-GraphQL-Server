const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const schema = require('./schema');
const app = express();
const PORT = 3000
const connectMongo = require('./mongo-connector');
const { authenticate } = require('./authenticate');
const dataloaders = require('./dataloaders');

(async () => {
  const mongo = await connectMongo();
  const graphqlExpressConfiguration = async (req, res) => {
    const user = await authenticate(req, mongo.Users);
    return {
      schema,
      context: { 
        mongo, 
        user, 
        dataloaders: dataloaders(mongo), 
      }, // `context ` is a special GraphQL object that gets passed to all resolvers, so it's a perfect place to share code between them
    };
  };

  app.use('/graphql', bodyParser.json(), graphqlExpress(graphqlExpressConfiguration));

  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'bearer token-heraclio.rios@vivintsolar.com'`, // This header is passed on all the calls, we'd want to make this source a JWT.
  }));

  app.listen(PORT, () => {
    console.log(`Hackernews GraphQL server running on port ${PORT}.`)
  });
})();
