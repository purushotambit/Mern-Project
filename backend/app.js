const express=require('express');
const connectToMongo = require('./db');
connectToMongo();
const app=express();
const PORT=5000
app.use(express.json())//This is for if we want use req.body()
app.use('/api/auth',require('./routers/auth'));
app.listen(PORT,()=>{
    console.log(`Server is concetted with http://localhost:${PORT}`);
})