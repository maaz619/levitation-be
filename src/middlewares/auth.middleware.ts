import { IToken } from "../utils/auth";
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const protect = async (
    req: Request & { user: jwt.JwtPayload },
    res: Response,
    next: NextFunction
) => {
    const bearer = req.headers.authorization
    console.log(bearer)

    if (!bearer) {
        res.status(401).json({ message: 'not authorized' })
        return
    }

    const [, token] = bearer.split(' ')

    if (!token) {
        res.status(401).json({ message: 'not valid token' })
        return
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string)
        req.user = user as IToken
        next()
    } catch (error) {
        res.status(401).json({ message: 'not valid token 2' })
        return
    }
}