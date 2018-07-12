import { Schema, Model, model, Document } from 'mongoose';

interface ITodo {
    title: string;
    description: string;
    createdAt: Date;
    author: Schema.Types.ObjectId;
    completedAt?: Date;
}

interface ITodoModel extends ITodo, Document {}

const TodoSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

export const Todo: Model<ITodoModel> = model("Todo", TodoSchema);