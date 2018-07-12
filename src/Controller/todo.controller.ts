import { Request, Response } from 'express';

import { Todo } from '../Models/todo';


export class TodoController {
    async getAllTodos(req: Request, res: Response) {
        try {
            if (req.user) {
                const { _id } = req.user;
                const todos = await Todo.find({ author: _id });
                res.json({
                    success: true,
                    todos
                });
            } else {
                throw "";
            }
        } catch (e) {
            res.status(400).json();
        }
    }

    createNewTodo = async (req: Request, res: Response) => {
        try {
            if (req.user) {
                const { _id } = req.user;
                const { title, description } = req.body;
                const newTodo = new Todo({ title, description, author: _id });
                const todo =  await newTodo.save();
                res.json({
                    success: true,
                    todo
                });
            } else {
                throw "";
            }
        } catch (e) {
            res.status(400).json();
        }
    }

    updateTodo = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            if (req.user) {
                const { id: author} = req.user;
                const { completed } = req.body;
                const date = new Date().toISOString();
                const todo = await Todo.findOneAndUpdate({ author, _id: id }, { $set: { completedAt: date, completed }}, { new: true });
                if (!todo) throw `invalid id ${id}`;

                res.json({
                    success: true,
                    todo
                });
            }
        } catch (e) {
            if (e === `invalid id ${id}`) {
                res.status(400).json({
                    success: false,
                    error: e
                });
            } else {
                res.status(400).json({
                    success: false
                });
            }
        }
    }

    deleteTodo = async (req: Request, res: Response) => {
        const { id } = req.params;

        try {
            if (req.user) {
                const { _id: author } = req.user;
                const todo = await Todo.findOneAndRemove({ author, _id: id});
            }
        } catch (e) {

        }
    }
}