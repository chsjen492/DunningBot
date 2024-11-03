import mongoose, {mongo} from 'mongoose'

export async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("successfully connect MongoDB.")
    } catch (error) {
        throw new Error(error)
    }
}

export async function close() {
    try {
        await mongoose.connection.close(false)
        console.log("connection closed")
    } catch (error) {
        throw new Error("DB closing error")
    }
}

