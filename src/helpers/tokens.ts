import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config";
import { UserInterface } from "../interfaces/UserInterface";

/** Return a signed JWT from user data */
function createToken(user: UserInterface) {
    let payload = {
        id: user.id,
        username: user.username
    };
    return jwt.sign(payload, SECRET_KEY);
}
export default createToken;