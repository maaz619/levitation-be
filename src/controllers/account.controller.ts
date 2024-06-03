import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { IToken, generateToken } from "../utils/auth";
import AppError from "../utils/app-error";

async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const user: IUser = new User({
            ...req.body
        })
        const result = await user.save()
        result.password = ""
        res.status(201).send(result)
    } catch (error: any) {
        next(new AppError(`${error.message}`, 400))
    }
}

async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const user: IUser | null = await User.findOne({ email: req.body.email })
        if (!user) {
            throw new AppError('User not found', 404)
        }
        const isValid = await user.isPasswordValid(req.body.password)
        if (!isValid) {
            throw new AppError('Invalid password', 403)
        }
        const token = generateToken(user)
        res.status(200).json({
            token
        })
    } catch (error: any) {
        next(error)
    }
}

async function getProfile(req: Request & { user: IToken }, res: Response, next: NextFunction) {
    try {
        const user = await User.findById(req.user.id)
        if (!user)
            throw new AppError("user not found", 404)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

export { register, login, getProfile }