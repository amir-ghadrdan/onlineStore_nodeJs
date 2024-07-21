const mongodb = require("mongodb") 
const DB = require("../util/database")




module.exports = class User {
    constructor(username,email,cart,_id){
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id=_id;
    }
    save(){
        const db =DB.getdb();
        return db.collection("users").insertOne(this);
    }

    static findById(userId){
        const db = DB.getdb();
        return db.collection("users").findOne({_id:new mongodb.ObjectId(userId)});
          
    }
    addOrder(){
        const db = DB.getdb();
        return this.getCart().then(products=>{
            const order = {
                items : products,
                user:{
                    _id : new mongodb.ObjectId(this._id),
                    name : this.name
                }
            }
            return db.collection("orders")
            .insertOne(order)

        }).then(resualt=>{
            this.cart ={items:[]};
            return db.collection('users')
            .updateOne({_id : new mongodb.ObjectId(this._id)},
        {$set :{cart:{items:[]}}})
        });
    };
    getOrders(){
        const db = DB.getdb();
        return db.collection('orders')
        .find({'user._id': new mongodb.ObjectId(this._id)})
        .toArray();

    }
     
    addToCart(product) {
        if (!this.cart) {
            this.cart = { items: [] };
        } else if (!Array.isArray(this.cart.items)) {
            this.cart.items = [];
        }
    
        const cartproductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
    
        const updateCartItems = [...this.cart.items];
        let newquantity = 1; 
        if (cartproductIndex >= 0) {
            newquantity = this.cart.items[cartproductIndex].quantity + 1;
            updateCartItems[cartproductIndex].quantity = newquantity;
        } else { 
            updateCartItems.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: newquantity
            });
        }
    
        console.log(newquantity);
        const updatedCart = { items: updateCartItems };
        const db = DB.getdb();
        return db
            .collection("users")
            .updateOne({ _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: updatedCart } });
    }
    
    getCart() {

            const db=DB.getdb()
            const productIds=this.cart.items.map(i=>{
                return i.productId
            })
            return db.collection('product').find({_id:{$in: productIds}}).toArray()
            .then(products=>{
                return products.map(p=>{
                    return{...p,
                        quantity:this.cart.items.find(i=>{
                        return i.productId.toString()===p._id.toString();
                    }).quantity
                };
                })
            })
    }
    deleteItemFromCart(productId){
        const updatedCartItems = this.cart.items.filter(
            item=>{
                return item.productId.toString() !== productId.toString();
            }
        )
        const db = DB.getdb();
        return db
        .collection("users")
        .updateOne({_id:new mongodb.ObjectId(this._id)},
        {$set:{cart:{items : updatedCartItems}}})

    }

}
