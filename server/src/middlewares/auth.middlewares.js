import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

const authentication = async (req, res, next) => {
    try {
        const {token} = req.cookies;

    if (!token) {
        throw new ApiError(400, "Token is missing. Login Again");
    }

    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);

    if (decoded.id) {
        req.body.userId = decoded.id;
    } else {
        throw new ApiError(400, "Not Authorized. Login Again");
    }

    next();

    } catch (error) {
        next(error);        
    }
}

export {authentication};