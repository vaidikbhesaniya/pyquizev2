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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "https://pyquiz-full-taupe.vercel.app",
        "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
function getQuestionField(questionId) {
    switch (questionId) {
        case "1":
            return "question1";
        case "2":
            return "question2";
        default:
            throw new Error(`Invalid questionId: ${questionId}`);
    }
}
app.post("/api/v1/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, userName } = req.body;
    try {
        const user = yield db_1.default.data.findUnique({
            where: {
                email: email,
            },
        });
        if (user) {
            return res.status(404).json({ message: user.issubmitted });
        }
        const newuser = yield db_1.default.data.create({
            data: {
                email,
                userName,
                issubmitted: false,
            },
        });
        res.status(201).json({
            message: "User Created Successfully",
            id: newuser.id,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.post("/api/v1/questionsubmit/:questionId/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    const questionId = req.params.questionId;
    const id = req.params.id;
    try {
        yield db_1.default.data.update({
            where: {
                id: parseInt(id),
            },
            data: {
                [getQuestionField(questionId)]: code,
                issubmitted: false,
            },
        });
        res.status(201).json({ message: "Submitted Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.post("/api/v1/submit/:userid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = parseInt(req.params.userid);
    console.log(userid);
    try {
        yield db_1.default.data.update({
            where: {
                id: userid,
            },
            data: {
                issubmitted: true,
            },
        });
        res.status(201).json({ message: "Submitted Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.get("/api/v1/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield db_1.default.data.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        res.json(user);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.use("/api/v1/health", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
