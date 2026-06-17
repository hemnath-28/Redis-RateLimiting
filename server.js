const {createClient}=require('redis')
const express=require('express')
const app=express()
const redisurl="redis://localhost:6379"

const redisclient=createClient({url:redisurl})

const connectRedis=async()=>{
    try{
        await redisclient.connect()
        console.log("connected To Redis")
        console.log("Ping",await redisclient.ping())
    }
    catch(err){
        console.log("Errror connecting to Redis:",err)
    }
}
connectRedis()

app.get("/",(req,res)=>{
    res.send("Hello Wolrd in the HomePage")
})

app.listen(3000,()=>{
    console.log("Server is Running on Port 3000")
})
