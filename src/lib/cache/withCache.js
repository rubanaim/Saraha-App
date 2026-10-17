import {cacheProvider} from "./init.js";
//we use cache with frequently used services like get products

export function withCache(ttl=3600){  //3600 = 1 hr
    return async (req,res,next)=>{
        //request
        //(method + url)  << key
        let key = `${req.method}:${req.orginalUrl}`;

        // req.url >> '/'
        // req.originalUrl >> '/api/user/'
        const cached = await cacheProvider.get(key);
        if(cached){
            res.setHeader('X-Cache', "HIT");
            return res.json(JSON.parse(cached));
        }
        //interceptor >> intercept >> change response def
        //before: res.json(body) >> send client response
        //now : res.json(body) >> cache + send client response
        //bind method > create a new function where this refers to res
        //bind(res) makes sure that the original res.json function still has access to the correct res object
        // when you call it through originalJson(body).
        const originalJson = res.json.bind(res);

        //res.json() same >> res() >> originalJson(body);

        res.json = (async(body)=>{
            if(res.statusCode>=200 && res.statusCode < 300){
                //1. cache body "{message:"".success:true,data: [{},{]]"
                await cacheProvider.set(key, JSON.stringify(body), ttl);
                //2. send response
                res.setHeader('X-Cache',"MISS");
            }

            return originalJson(body);
        })
        next();
    }
}