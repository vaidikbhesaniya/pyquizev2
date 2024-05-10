import express from "express";
import { Response, Request } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import prisma from "./db/db";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: [
            "https://pyquiz-full-taupe.vercel.app",
            "http://localhost:5173",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

function getQuestionField(questionId: string) {
    switch (questionId) {
        case "1":
            return "question1";
        case "2":
            return "question2";
        default:
            throw new Error(`Invalid questionId: ${questionId}`);
    }
}

app.post("/api/v1/user", async (req: Request, res: Response) => {
    const { email, userName } = req.body;

    try {
        const user = await prisma.data.findUnique({
            where: {
                email: email,
            },
        });
        if (user) {
            return res.status(404).json({ message: user.issubmitted });
        }

        const newuser = await prisma.data.create({
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
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post(
    "/api/v1/questionsubmit/:questionId/:id",
    async (req: Request, res: Response) => {
        const { code } = req.body;
        const questionId = req.params.questionId;
        const id = req.params.id;

        try {
            await prisma.data.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    [getQuestionField(questionId)]: code,
                    issubmitted: false,
                },
            });

            res.status(201).json({ message: "Submitted Successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);
app.post("/api/v1/submit/:userid", async (req: Request, res: Response) => {
    const userid = parseInt(req.params.userid);
    console.log(userid);

    try {
        await prisma.data.update({
            where: {
                id: userid,
            },
            data: {
                issubmitted: true,
            },
        });

        res.status(201).json({ message: "Submitted Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/api/v1/user/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const user = await prisma.data.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.use("/api/v1/health", (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running" });
});

const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
