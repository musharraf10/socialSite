const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req.user.role; // Assuming req.user contains the authenticated user's data
      console.log(userRole)
      if (allowedRoles.includes(userRole)) {
        next(); // User has the required role, proceed to the next middleware/controller
      } else {
        res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
      }
    };
  };
  
  module.exports = roleCheck;