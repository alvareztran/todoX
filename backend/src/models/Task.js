import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ['active', 'completed'],
            default: 'active'
        },
        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
)

const Task = mongoose.model('Task', taskSchema);
export default Task;