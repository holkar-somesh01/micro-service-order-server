import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import orderrouter from "./routes/order.routes";
import cartrouter from "./routes/cart.routes";
import { connectToRabbitMQ } from "./service/rabbitmq";
dotenv.config();

const app = express();


app.use(express.json());
app.use(cookieParser())
app.use(cors(
    { origin: true, credentials: true }
))
// Routes
app.use("/api/order", orderrouter);
app.use("/api/cart", cartrouter);


app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Route not found" });
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    res.status(500).json({ message: "something went wrong", err })
});


mongoose.connect(process.env.MONGO_URI as string)

connectToRabbitMQ()

const PORT = process.env.PORT || 5000;
mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED")
    app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
})
