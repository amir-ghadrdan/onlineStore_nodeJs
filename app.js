var express = require("express")
var cors = require("cors")
var path = require("path")
var approut = require("./controllers/allRouters.js")
const bodyParser = require('body-parser');
const getdb = require("./util/database.js").getdb;
const mongoConnect = require("./util/database.js").mongoConnect;
const User = require("./models/User.js")

app = express()
app.use(cors())

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



app.use((req, res, next) => {
    User.findById("66993ddfa276726c446698f6")
        .then(user => {
            req.user = new User(user.username,user.email,user.cart,user._id);
            // console.log(req.user.name)
            next();
        })
        .catch(err => {
            console.error(err);
            next(err);  // Pass the error to the next middleware
        });
});


app.use(approut)
mongoConnect(() => {
    console.log("your app running in port 3000")
    console.log("please connect to the internet for mongodb connection")
    console.log("open the browser and search : http://localhost:3000/")
    app.listen(3000)
})
