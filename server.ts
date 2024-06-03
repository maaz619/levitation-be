import http from "node:http"
import app from "./app"
import mongoose from "mongoose"

const server = http.createServer(app)
const PORT = process.env.PORT ?? 8090

async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "", {})
        console.log("DB connected")
    } catch (error) {
        console.log(error)
    }
}


server.listen(PORT, () => {
    dbConnect()
    console.log(`${process.env.NODE_ENV} server started at ${PORT}`)
})