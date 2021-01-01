const express = require('express');
const app = express(); //initialize express
const bodyParser = require('body-parser'); //body parsing middleware
const cors = require('cors');
require('dotenv').config()
const fetch = require('node-fetch');
const mongodb = require('mongodb'); //MongoDB driver 
const mongoClient = mongodb.MongoClient;
// const url = process.env.MONGODB_URL;
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

// app.get("/",async (req, res) => {
//     const recip = await fetch("https://api.edamam.com/search?q=indian&to=60&app_id=724d3e29&app_key=2cdc2065a67f360c02fabd817b3e60f1");
//     const data = await recip.json();
//     array = data.hits;
//     array.forEach(element => {
//         recipesData.push(element)
//     });
//     console.log(recipesData)
//     return res.json({ message: 'done' });
// });

// app.post('/copydata', async (req, res) => {
//     let client = await mongoClient.connect(url, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }); //connect to db

//     let db = client.db("recipesrover"); //db name
//     let recipe = db.collection("recipes"); //collection name
//     recipesData.forEach(ele => {
//         recipe.insertOne({
//             uri: ele.recipe.uri,
//             label: ele.recipe.label,
//             image: ele.recipe.image,
//             source: ele.recipe.source,
//             url: ele.recipe.url,
//             ingredientLines: ele.recipe.ingredientLines,
//             ingredients: ele.recipe.ingredients,
//             calories: ele.recipe.calories,
//             totalNutrients: ele.recipe.totalNutrients,
//             cautions: ele.recipe.cautions,
//             healthLabels: ele.recipe.healthLabels,
//             yield: ele.recipe.yield,
//             dietLabels: ele.recipe.dietLabels,
//             totalWeight:ele.recipe.totalWeight,
//             digest: ele.recipe.digest
//         });
//     })
//     return res.json({ message: 'done' });
// })

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