import jwt from "jsonwebtoken"
import { IUser } from "../models/user.model"

export interface IToken {
    id: string
}

const generateToken = (user: IUser): string => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET as jwt.Secret,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
}

export { generateToken }