var express = require("express")
var cors= require("cors")
var path= require("path")
const Product= require("../models/Product");
const User= require("../models/User");
const { PassThrough } = require("stream");
const mongodb  = require("mongodb");

var Routers=express.Router();

Routers.post("/create-order",(req,res)=>{
     req.user.addOrder().then(
        result=>{
            res.redirect("/orders")
        }
     ).catch(err=> console.log(err))
})
Routers.get("/orders",(req,res)=>{
    req.user.
    getOrders().
    then(orders=>{
        res.render('orders',{
            path:'/orders',
            pageTitle:'Your Orders',
            orders:orders
        })
    }).catch(err=>console.log(err))
})
Routers.get("/",(req,res)=>{
    res.render("main",{path:"/"})
    // res.redirect("/")
})
Routers.get("/cart",(req,res)=>{
        req.user.
        getCart().
        then(products=>{
            res.render("cart",{            
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products})
        })
    
})
Routers.post("/cart-delete-item",(req,res)=>{
    const productid = req.body.productId;

    console.log(req.body)
    req.user.
    deleteItemFromCart(productid).
    then(()=>{
         res.redirect("/cart")
    })

})



Routers.get("/addToCart/:productid",(req,res)=>{
    const prodid=req.params.productid
    Product.findById(prodid).then(product=>{

        req.user.addToCart(product).then((resualt)=>{
            res.redirect("/cart")
        })
       
    })
})
Routers.get("/delete_product/:productid", (req, res) => {
    const prodid = req.params.productid;
    Product.deleteById(prodid)
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).redirect("/cart");
            } else {
                res.status(404).send({ message: "Product not found" });
            }
        })
        .catch(error => {
            console.error("Error deleting product:", error);
            res.status(500).redirect("/cart");
        });
});
Routers.get("/form/:prodid?",(req,res)=>{
    const productId=req.params.prodid
    res.render("form.ejs",{prodId:productId,path:"/products"})
})
Routers.get("/a",(req,res)=>{
    res.render("nav",{})
})
Routers.post("/add_update_product/:prodid?",(req,res)=>{
    let prodId
    if(req.params.prodid){
        prodId=new mongodb.ObjectId(req.params.prodid)
    }
    else{
         prodId=null
    }
    
    const product = new Product(req.body.name,req.body.description,req.body.price,prodId,req.user._id)
    product
    .save()
    .then(() => {
       res.redirect("/")
    })
    .catch(err => console.log(err));
    
})



Routers.get("/shop",(req,result)=>{
    Product.fetchAll().then(products=>{
        result.render("shop",{prods:products,username:req.user.name,path:"/shop"})
    })

})

module.exports=Routers