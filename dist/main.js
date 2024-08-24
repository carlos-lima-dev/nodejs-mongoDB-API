"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const swagger_1 = __importDefault(require("./docs/swagger"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const homeRoutes_1 = __importDefault(require("./routes/homeRoutes"));
// Load environment variables
dotenv_1.default.config();
// App configuration
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "";
// Middleware setup
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use((0, express_fileupload_1.default)());
app.use((0, compression_1.default)());
app.use(body_parser_1.default.json());
// Static file serving
app.use(express_1.default.static("static"));
app.use(express_1.default.static(path_1.default.join(__dirname, "views")));
// Use the home route
app.use("/", homeRoutes_1.default);
// API Routes
app.use("/api", productRoutes_1.default);
app.use("/auth", userRoutes_1.default);
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.set("strictQuery", true);
        yield mongoose_1.default.connect(String(MONGO_URI));
        console.log("sucessely connected to database");
        app.listen(PORT, () => {
            console.log(`server is ok at http://localhost:${PORT}`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
});
(0, swagger_1.default)(app);
startApp();
