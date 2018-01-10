const jwt = require('jsonwebtoken')

exports.getAuthorize = async (req, res, next) => {

    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token']

    // decode token
    if (token) {

        // verifies secret and checks exp
        try {
            let decoded = await jwt.verify(token, process.env.JWT_SECRET)
            req.decoded = decoded
            return next()
        } catch (err) {
            throw new Error(err)
        }
    }

    return res.json({ error: 'Error' })
}