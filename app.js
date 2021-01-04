const express = require('express');
const app = express(); //initialize express
const bodyParser = require('body-parser'); //body parsing middleware
const cors = require('cors');
require('dotenv').config()
const mongodb = require('mongodb'); //MongoDB driver 
const mongoClient = mongodb.MongoClient;
app.use(bodyParser.json());

app.options('*', cors())
app.use(cors())

const url = process.env.MONGODB_URL;

mongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, db) {
    if (err) throw err;
    console.log("Database Connected!");
    db.close();
});


app.get("/", (req, res) => {
    res.send('Namaste From Server..')
});

app.get("/recipes",async (req, res) => {
    let client = await mongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }); //connect to db

    let db = client.db("recipesrover"); //db name
    let recipe = db.collection("recipes"); //collection name
    recipe.find({}).toArray((err, result) => {
        if (result) {
            return res.json({
                    result
            })
        }
    })
});

app.get("/recipes/:q",async (req, res) => {
    const {q} = req.params
    let id = new mongodb.ObjectId(q); 
    let client = await mongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }); //connect to db
    let db = client.db("recipesrover"); //db name
    let recipe = db.collection("recipes"); //collection name
    recipe.findOne({_id: id},(err, result) => {
        if (result) {
            return res.json({
                    result
            })
        }
    })
});

app.delete("/delete/:q",async (req, res) => {
    const {q} = req.params
    let id = new mongodb.ObjectId(q); 
    let client = await mongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }); //connect to db
    let db = client.db("recipesrover"); //db name
    let recipe = db.collection("recipes"); //collection name
    try {
    recipe.deleteOne({_id:id})
    } catch (e) {
    console.log(e);
    }
    return res.sendStatus(201)
});

app.put("/update/:q",async (req, res) => {
    const {q} = req.params
    const {publisher,label,image,ingredients,instructions,serves,calories,timetaken,difficulty,cost,onepotmeal,tastetexture,occasion,meal} = req.body
    const ingredients_ = ingredients.split('-');
    const instructions_ = instructions.split('-');
    let id = new mongodb.ObjectId(q);
    let client = await mongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }); //connect to db
    let db = client.db("recipesrover"); //db name
    let recipe = db.collection("recipes"); //collection name
    recipe.updateOne({_id:id},{
    $set:{
        label: label,
        image: image,
        ingredients: ingredients_.slice(1,ingredients_.length),
        instructions: instructions_.slice(1,instructions_.length), 
        calories: calories,
        publisher: publisher,
        timetaken: timetaken,
        difficulty: difficulty,
        onepotmeal: onepotmeal,
        tastetexture: tastetexture,
        cost: cost,
        occasion: occasion,
        meal: meal,
        serves: serves
    }})
    return res.sendStatus(201)
});

app.post("/publish",async (req, res) => {
    const {publisher,label,image,ingredients,instructions,serves,calories,timetaken,difficulty,cost,onepotmeal,tastetexture,occasion,meal} = req.body
    const ingredients_ = ingredients.split('-');
    const instructions_ = instructions.split('-');
    
    let client = await mongoClient.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }); //connect to db
    let db = client.db("recipesrover"); //db name
    let recipe = db.collection("recipes"); //collection name
    recipe.insertOne({
        label: label,
        image: image,
        ingredients: ingredients_.slice(1,ingredients_.length),
        instructions: instructions_.slice(1,instructions_.length), 
        calories: calories,
        publisher: publisher,
        timetaken: timetaken,
        difficulty: difficulty,
        onepotmeal: onepotmeal,
        tastetexture: tastetexture,
        cost: cost,
        occasion: occasion,
        meal: meal,
        serves: serves
    });
    return res.sendStatus(201)
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server running')
});