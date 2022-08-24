const express = require("express");
require("dotenv").config();
require("express-async-errors");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");
const connectDB = require("./db/connect");
const productRouter = require("./routes/products");
const app = express();

//middleware

app.use(express.json());
// routes
app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>products routes</a>");
});

app.use("/api/v1/products", productRouter);
// products route

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`server is listening to port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
