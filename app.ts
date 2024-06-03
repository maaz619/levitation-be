import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from "express"
import accountRouter from "./src/routes/account.route"
import invoiceRouter from "./src/routes/invoice.route"
import morgan from "morgan"
import env from 'dotenv'
import puppeteer from "puppeteer";
import fs from "fs"

env.config()

const app = express()

app.use(morgan("dev"))
app.use(express.json())

if (process.argv[2] === '--dev') process.env.NODE_ENV = 'dev'
else process.env.NODE_ENV = 'prod'

app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin (replace * with your specific origin if known)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // Allow specified HTTP methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specified headers

    // Handle preflight requests (OPTIONS method)
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
})

app.use('/api/v1/auth', accountRouter)
app.use('/api/v1/', invoiceRouter)

app.get("/", (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.json({
        status: "Active",
        message: "Welcome!"
    })
})

if (process.env.NODE_ENV === 'dev') {
    // errorHandler for only development environment
    const errorHandlerDev: ErrorRequestHandler = (err, req, res, next) => {
        res.status(err.statusCode).json({
            status: err.status,
            err: err,
            message: err.message,
            stack: err.stack,
        });
    }
    app.use(errorHandlerDev)
}
else {
    // errorHandler for only produnction environment
    const errorHandlerProd: ErrorRequestHandler = (err, req, res, next) => {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    }
    app.use(errorHandlerProd)
}


export default app