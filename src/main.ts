import express, {Request, Response} from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import compression from "compression";
import path from "path";
import SetupSwagger from "./docs/swagger";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import homeRoutes from "./routes/homeRoutes";

// Load environment variables
dotenv.config();

// App configuration
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "";

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(fileUpload());
app.use(compression());
app.use(bodyParser.json());

// Static file serving
app.use(express.static("static"));
app.use(express.static(path.join(__dirname, "views")));

// Use the home route
app.use("/", homeRoutes);

// API Routes
app.use("/api", productRoutes);
app.use("/auth", userRoutes);

const startApp = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(String(MONGO_URI));
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
