const app = require("express");
const app = express();

// routes
app.call('/secret', (req, res, next) => {
    console.log("Accessing the sceret sections...");
    next();
})

app.get ('/', (req, res) => {
    res.send("Hello world");
})