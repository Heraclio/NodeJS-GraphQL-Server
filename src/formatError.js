// This will allow us to change the contents of error messages sent to GraphQL clients
const { formatError } = require('graphql');

module.exports = error => {
    const data = formatError(error);
    const { originalError } = error;
    // This will add the `field` key into the error data now.
    data.field = originalError && originalError.field;
    return data;
};