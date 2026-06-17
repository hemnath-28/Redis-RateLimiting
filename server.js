const express=require('express')
const app=express()
const fixed = require("./FixedWindow")


app.get("/",fixed,(req,res)=>{
    res.send("Hello Wolrd in the HomePage")
})

app.listen(3000,()=>{
    console.log("Server is Running on Port 3000")
})
