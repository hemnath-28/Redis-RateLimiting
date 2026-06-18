
const client=require('./redis')

async function sliding(req,res,next){
    // This Method is based on get previos minute request
    // Get current Minute request
    // Previous window Carried Weightage
    // Of hOw much minute have Passed in this
    // Previous*weightage + current
    // Remembers get,set String method returns in String
    const ip=req.ip
    const Time=Date.now()
    const minute=Math.floor(Time/60000)
    console.log(minute)
    
    const currkey=`user:Counter:${ip}:${minute}`
    const prevkey=`user:Counter:${ip}:${minute-1}`
    await client.incr(currkey)
    const previous=Number(await client.get(prevkey)) || 0
    const current=Number(await client.get(currkey)) || 0
    console.log("Current Window:",current)
    console.log("Previpus Window:",previous)
    const timeelapsedminute=60-new Date().getSeconds();

    const windowpercentage=(timeelapsedminute/60)
    console.log(timeelapsedminute,windowpercentage)
    const tokensconsumed=(previous*windowpercentage)+current
    console.log(tokensconsumed)
    if (tokensconsumed>30){
        return res.status(429).json("You have err too Many request Try Again")    
    }
    await client.expire(currkey,120)
    next()
}
module.exports=sliding