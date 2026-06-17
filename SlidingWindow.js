const client=require("./redis")
const crypto=require("crypto")
async function SlidingWindow(req,res,next){

    const slikey=`limit:user:${req.ip}`
    const time=Date.now()
    try{
        await client.zAdd(slikey,{
        score:Number(time),
        value:crypto.randomUUID()
    })
    
    await client.zRemRangeByScore(slikey,0,time-60000)
    const count=await client.zCard(slikey)
    console.log("Total Count request:",count)
    await client.expire(slikey,60)
    if (count>20){
        console.log("request count: Expired",count)
        return res.status(429).json("Too Many Request Try Again Later")
        
    }
    
    next()
    }
    
    catch(err){
        console.log("Error in the Sliding Window ",err)
        next()
    }
  
}
module.exports=SlidingWindow