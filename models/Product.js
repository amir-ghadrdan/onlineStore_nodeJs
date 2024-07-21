const db = require('../util/database');
const mongodb = require("mongodb")


module.exports = class Product {
  constructor(title, description, price,id,userId) {
    this.title = title;
    this.description = description;
    this.price = price;
    this._id=id;
    this.userId=userId;
  }

  save() {
    let dbop;
    if(this._id == null) {
        dbop = db.getdb().collection('product').insertOne({
            title: this.title,
            description: this.description,
            price: this.price,
            userId:this.userId
        });
        console.log(this);
    } else {
        dbop = db.getdb().collection('product')
            .updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this});
        console.log(this);
    }
    return dbop
    .then((result) => {
      console.log(result)
      
    }).catch((err) => {
      console.log(err)      
    });
  }

  static deleteById(id) {
    return db.getdb().collection('product')
        .deleteOne({_id: new mongodb.ObjectId(id)}).then(res=>{
          console.log("yess")
        }).catch(err=>{
          console.log("noo")
        });
}

  static fetchAll() {
    return db.getdb().collection('product').find()
    .toArray().then(products=>{
      return products;
    })
    .catch(err=>{
      console.log(err);
    })
  }

  static findById(prodId) {

    return db.getdb()
      .collection('product')
      .findOne({ _id:new mongodb.ObjectId(prodId)}) 
      .then(product => {
        return product;
      }) 
      .catch(err => {
        console.log(err);
      });
  }




};

