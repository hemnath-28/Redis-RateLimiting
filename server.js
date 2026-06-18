const express=require('express')
const app=express()
const fixed = require("./FixedWindow")   //Fixedwindow
const sliding=require("./SlidingWindow")  //SlidingWindow
const tokenbucket=require("./Tokenbucket")
const counter=require("./SlidingCounter")
app.get("/",counter,(req,res)=>{
    res.send("Hello Wolrd in the HomePage")
})
const time=Date.now()
console.log(time)

app.listen(3000,()=>{
    console.log("Server is Running on Port 3000")
})
