const express = require('express')
const config = require("config")
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const port = config.get('PORT')
const {
    open
} = require('sqlite')
const app = express()


app.use(express.json())
start = async () => {
    open({
        filename: "./db/tilt-db",
        driver: sqlite3.Database
    }).then((db) => {
        try {
            app.post('/registration', async (req, res) => {
                const {
                    username,
                    password
                } = req.body
                const hash = await bcrypt.hash(password, 4)
                const result = await db.all(`SELECT * FROM users WHERE username = "${username}"`)
                if (result.length > 0) {
                    return res.status(400).json({
                        message: 'Пользователь с таким username уже существует'
                    });
                } else {
                    await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function (err) {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                error: 'че то не але'
                            });
                        } else {
                            return res.json({
                                message: 'Пользователь зарегистрирован'
                            });
                        }
                    });
                }
            })
            app.listen(port, () => {
                console.log("Сервер запущен на: ", port)
            })
        } catch (e) {
            console.log(e)
        }
    })
}

start()