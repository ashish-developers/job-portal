const jwt = require('jsonwebtoken');

// Generic JWT middleware — attaches decoded payload to req.auth
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    req.auth = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Restrict to specific roles
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.auth?.role))
    return res.status(403).json({ success: false, message: 'Forbidden' });
  next();
};

// Employer sub-user JWT — attaches employer_id, permissions
const employerAuthenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.user_id     = decoded.id;
    req.employer_id = decoded.employer_id;
    req.is_admin    = decoded.is_admin;
    req.permissions = decoded.permissions || [];
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Permission check for employer sub-users
const can = (slug) => (req, res, next) => {
  if (req.is_admin || req.permissions.includes('*') || req.permissions.includes(slug))
    return next();
  res.status(403).json({ success: false, message: `Permission denied: ${slug}` });
};

module.exports = { authenticate, requireRole, employerAuthenticate, can };
