import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import marketRoutes from "./routes/MarketRoutes.js";

dotenv.config();

console.log(
  "API KEY:",
  process.env.FINNHUB_API_KEY
    ? `${process.env.FINNHUB_API_KEY.slice(0, 4)}...${process.env.FINNHUB_API_KEY.slice(-4)}`
    : "NOT FOUND"
);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "TradeLab backend is running"
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Frontend can communicate with TradeLab backend"
  });
});

app.use("/api", marketRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TradeLab backend running on PORT ${PORT}`);
});