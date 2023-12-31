const express = require("express")
const path = require("path")
const app = express()
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/', (req, res) => {
    res.render('login')
})

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    }

    try {
        const checking = await LogInCollection.findOne({ name: req.body.name })

        if (checking && checking.name === req.body.name && checking.password === req.body.password) {
            res.send("User details already exist")
        } else {
            await LogInCollection.insertMany([data])
            res.status(201).render("home", {
                naming: req.body.name
            })
        }
    } catch (error) {
        console.error(error);
        res.send("Something went wrong")
    }
})

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check && check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
        } else {
            res.send("Incorrect password or user does not exist")
        }
    } catch (error) {
        console.error(error);
        res.send("Something went wrong")
    }
})

app.listen(port, () => {
    console.log('Server is running on port', port);
})
