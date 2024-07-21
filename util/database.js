// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'products',
//     password: 'Amgh1383'
// });
// module.exports = pool.promise();



const mongodb = require("mongodb");
// const Product = require("../models/Product");
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect =(callback)=>{
    MongoClient.connect("mongodb://localhost:27017").then(
        (client)=>{
            _db=client.db("product")
            callback(client)
        }

    ).catch(err=>{
    
        console.log(err)
    })
}
const getdb=()=>{
    if(_db){
        return _db
    }
    throw "No Database found"
}

// module.exports=mongoConnect;
exports.mongoConnect=mongoConnect;
exports.getdb=getdb;