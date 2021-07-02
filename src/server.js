const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require("helmet");
const dotenv = require('dotenv')
const userRoutes = require("./router/userRoute");
const accountRoutes = require("./router/accountRoute");
const transactionRoutes = require("./router/transactionRoute");

dotenv.config();
const app = express()


app.use(cors())
app.use(helmet());
app.use(express.urlencoded({extended:false}))
app.use(express.json())


if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
}

app.use("/user", userRoutes);
app.use("/account", accountRoutes);
app.use("/transaction", transactionRoutes)

const PORT = process.env.PORT || 5005
app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    )