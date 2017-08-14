const HEADER_REGEX = /bearer token(.*)$/;
// This will allow us to detect what user triggered each of the GraphQL request
module.exports.authenticate = async ({headers: {authorization}}, Users) => {
    const email = authorization && HEADER_REGEX.exec(authorization)[1];
    return email && await Users.findOne({email});
};
/**
 * This is an extremely simple token. In real applications make
 * sure to use a better one, such as JWT (https://jwt.io/).
 */
