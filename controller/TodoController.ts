import type { NextFunction, Request, Response } from "express";
import { Todo } from "../model/todoModel";



interface IAuth extends Request{
    user: any
}

export const createTodo = async (
  req: IAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      color,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const todo = await Todo.create({
      title,
      description,
      status,
      priority,
      dueDate,
      color,
      user: user._id,
    });


    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyTodo= async(  req: IAuth,res: Response,next: NextFunction)=>{
try {
  const user = req.user;

  const todo = await Todo.find({user:user._id}).select("-user");





return res.status(200).json({
  success:true,
  todo
})







} catch (error) {
  next(error)
}
}


export const DeleteTodo = async (
  req: IAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (!todo.user.equals(user._id)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await todo.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateTodo = async (req: IAuth,res: Response,next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (!todo.user.equals(user._id)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      color,
    } = req.body;

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (status !== undefined) todo.status = status;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate;
    if (color !== undefined) todo.color = color;

    await todo.save();

    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo,
    });
  } catch (error) {
    next(error);
  }
};
