import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import mongoose, {Connection} from "mongoose";
import SetupSwagger from "./docs/swagger";
import userRoutes from "./routes/userRoutes";
import compression from "compression";
import path from "path";
import {Request, Response} from "express";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI || "";

app.use(express.json());
app.use(cors());
app.use(express.static("static"));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
app.use(compression());

// Serve static files from the 'views' directory
app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "views", "404.html"));
});

//import user and productss
app.use("/api", productRoutes);
app.use("/auth", userRoutes);

const startApp = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(String(MONGO));
    console.log("sucessely connected to database");
    app.listen(PORT, () => {
      console.log(`server is ok at http://localhost:${PORT}`);
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
};
SetupSwagger(app);
startApp();
