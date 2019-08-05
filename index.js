const Promise = require("./promise");
new Promise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("1");
    },0)
}).then((res)=>{
    console.log(res);
    return("2")
},(rej)=>{
    console.log(rej);
}).then(res=>{
    console.log(res);
    return("3")
}).then(res=>{
    console.log(res);
})