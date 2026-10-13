import cors from "cors";
import express from "express";
import exemploRoutes from "./interfaces/http/routes/exemploRoutes";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:8081",
  }),
);

app.use(express.json());
app.use("/api", exemploRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
