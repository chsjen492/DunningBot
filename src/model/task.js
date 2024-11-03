import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

taskSchema.index({ deadline: 1 })

export function getTasks() {
    return this.find({
        deadline: { $gt: new Date() }
    })
        .sort({ deadline: 1 })
        .limit(3)
}

export default mongoose.model('tasks', taskSchema)