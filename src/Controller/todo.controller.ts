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

    // updateTodo = async (req: Request, res: Response) => {
    //     try {
    //         if (req.user) {
    //             const { _id: author} = req.user;
    //             const { _id } = req.params;


    //         }
    //     } catch (e) {

    //     }
    // }
}