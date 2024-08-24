"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAndCheckRoles = authenticateAndCheckRoles;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_KEY || "";
// Middleware to authenticate token and check roles
function authenticateAndCheckRoles(roles) {
    return function (req, res, next) {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized. No token provided" });
        }
        jsonwebtoken_1.default.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res
                    .status(403)
                    .json({ error: "Forbidden access. Invalid or expired token" });
            }
            // Attach the user info to the request object
            req.user = user;
            // Check if the user has the required role
            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({
                    error: "Forbidden access. User doesn't have the required role",
                });
            }
            next();
        });
    };
}
