import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
    },
    week: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model('Task', taskSchema)
