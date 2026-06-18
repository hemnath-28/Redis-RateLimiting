const client=require("./redis")

async function tokenBucket(req,res,next){
    const ip=req.ip
    const key=`bucket:user:${ip}`
    // First Set the token , refill
    // Refill the Token based on the Time taken * refresh rate
    //If token <1 then return 429 Error

    const maxtoken=20
    const refreshrate=1
    const time=Date.now()
    let tokens;
    let lastrefill;
    
    const checkexists=await client.exists(key)
    if (checkexists){
          //Rate at which new token gets Added To Bucket
        const data=await client.hGetAll(key)
        tokens=Number(data.token)
        lastrefill=Number(data.lastrefill)
        
    }
    else{
        tokens=maxtoken
        lastrefill=time
    }
    const elapsed=(time-lastrefill)/1000
    const newtokens=elapsed*refreshrate
    tokens=Math.min(maxtoken,tokens+newtokens)
     if (tokens < 1) {
            return res
                .status(429)
                .json("Too Many Requests")
        }
    tokens--;
    await client.hSet(key,{
        token:tokens,
        lastrefill:time
    })
    await client.expire(key,60)
    console.log(
            `IP=${ip} Tokens Remaining=${tokens.toFixed(2)}`
        )
    next()

}

module.exports=tokenBucket