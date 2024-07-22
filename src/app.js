const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const messageRouter = require("./routes/messages.router.js");
const sessionRouter = require("./routes/api/session.router.js");
const viewsRouter = require("./routes/views.router.js");
const dotenv = require("dotenv");
const passport = require("passport");

const initializePassport = require("./config/passport.config.js");

dotenv.config();

const app = express();
const PORT = 8080;

app.use(cookieParser());

app.use(
  session({

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
    secret: "secretCode",
    resave: false,
    saveUninitialized: true,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

const connectMongoDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  try {
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error en la conexión", error);
  }
};

connectMongoDB();

app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);
app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", messageRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));