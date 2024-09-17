const express = require('express');

const app = express();

app.use((req,res)=>{
    res.send("Hello From The Server")
})

app.listen(3000,()=>{
    console.log("Server @ port 3000")
})