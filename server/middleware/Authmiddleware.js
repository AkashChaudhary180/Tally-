import jwt from "jsonwebtoken";
import User from "../models/User.js";

// "Middleware" = a function that sits BETWEEN the incoming request and
// your route's controller. It can inspect/modify the request, or block it.
// This one checks: "does this request have a valid login token?"
const protect = async (req, res, next) => {
  let token;

  // The frontend will send the token like: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1]; // grab the part after "Bearer "

      // Verify the token was signed with OUR secret and hasn't expired/been tampered with
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the logged-in user to req, so any controller after this
      // can access req.user (e.g. to know WHO is making the request)
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // token valid — let the request continue to the controller
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;