const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require("helmet");
const dotenv = require('dotenv')
const userRoutes = require("./router/userRoute");
const accountRoutes = require("./router/accountRoute");
const transactionRoutes = require("./router/transactionRoute");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');


dotenv.config();
const app = express()

app.use(cookieParser());

app.use(cors())
app.use(helmet());
app.use(express.urlencoded({extended:false}))
app.use(express.json())


if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use("/user", userRoutes);
app.use("/account", accountRoutes);
app.use("/transaction", transactionRoutes)

const PORT = process.env.PORT || 5005
app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    )