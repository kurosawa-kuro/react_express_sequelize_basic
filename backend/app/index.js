const express = require('express')
const createError = require('http-errors');
const asyncHandler = require('express-async-handler')

const { errorHandler } = require('../middleware/errorMiddleware');
const { sequelize, User, Post } = require("../db/models/index")

const app = express()

app.use(express.json())

app.post('/users', asyncHandler(async (req, res) => {
    const body = req.body

    const user = await User.create(body)

    return res.json(user)
}))

app.get('/users', asyncHandler(async (req, res) => {
    try {
        const users = await User.findAll()
        // const [results, metadata] = await sequelize.query("SELECT * FROM users");
        // console.log({ metadata })

        return res.json(users)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}))

app.get('/users/:id', asyncHandler(async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findOne({
            where: { id },
            include: 'posts',
        })

        // console.log(JSON.stringify(user, null, 2))
        // console.log(JSON.stringify(user.posts, null, 2))

        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}))

app.delete('/users/:id', asyncHandler(async (req, res) => {
    const id = req.params.id
    try {
        const user = await User.findOne({ where: { id } })

        await user.destroy()

        return res.json({ message: 'User deleted!' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}))

app.put('/users/:id', asyncHandler(async (req, res) => {
    const id = req.params.id
    const { name, email, role } = req.body
    try {
        const user = await User.findOne({ where: { id } })

        user.name = name
        user.email = email
        user.role = role

        await user.save()

        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
}))

app.post('/posts', asyncHandler(async (req, res) => {
    console.log("hits post's posts")
    const { body } = req.body

    console.log({ body })
    try {
        const user = await User.findOne({ where: { id } })

        const post = await Post.create({ body, userId: user.id })

        return res.json(post)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}))

app.get('/posts', asyncHandler(async (req, res) => {
    try {
        const posts = await Post.findAll({ include: 'user' })

        return res.json(posts)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
}))

const todos = [{ id: 1, name: 'aaaaaaa', completed: false }]
/* GET users listing. */
app.get('/todos', asyncHandler(function (req, res, next) {
    console.log("hit get /todos")
    res.json(todos);
}))

app.get('/todos/:id', asyncHandler(function (req, res, next) {
    const id = req.params.id
    const foundTodo = todos.find((todo) => todo.id === Number(id))
    console.log({ foundTodo })
    if (!foundTodo) {
        res.statusCode = 404
        throw new Error('todo not found');
    }
    res.json(foundTodo);
}))

app.post('/todos', function (req, res, next) {
    console.log('hit post todos')
    const { body } = req
    console.log({ body })

    if (typeof body.name !== 'string') {
        res.statusCode = 422
        throw new Error('name must string');
    }

    const newTodo = {
        id: todos.length + 1,
        name: body.name,
        completed: false
    }

    todos.push(newTodo)
    res.status(201).json(newTodo);
});

app.use(errorHandler);

module.exports = app;

