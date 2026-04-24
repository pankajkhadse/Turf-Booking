export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        // verifyToken must run before this — req.user must exist
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // check if the user role is in the allowed list
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. This route is for ${allowedRoles.join(' or ')} only.`
            })
        }

        next()
    }
}