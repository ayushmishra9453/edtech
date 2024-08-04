const express=require('express')
const app=express();

const userRoutes=require('./routes/User')
const profileRoutes=require('./routes/Profile')
const paymentRoutes=require('./routes/Payments')
const courseRoutes=require('./model/Course')

const database=require('./config/database')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const {cloudinaryConnect}=require('./config/cloudinary')
const fileUpload=require('express-fileupload')
require("dotenv").config();
const PORT=process.env.PORT || 3000;
// database connection
database.connect();
// middlewares
app.use(express.json());
app.use(cookieParser)
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp"
    })
)

// cloudinary connect 
cloudinaryConnect();

// userRoutes

app.use("/api/v1/auth",userRoute)
app.use("/api/v1/profile",profileRoute)
app.use("/api/v1/course",courseRoute)
app.use("/api/v1/payment",paymentRoutes)

// defualt route

app.get("/",(req,res)=>{
    return res.json(
        {
            success:true,
        message:"Your server is up and running"
        }
    )
})

app.listen(PORT,()=>{
    console.log('App is running at port number',PORT);
})