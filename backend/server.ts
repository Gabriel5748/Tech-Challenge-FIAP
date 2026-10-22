import cors from "cors";
import express from "express";
import exemploRoutes from "./interfaces/http/routes/exemploRoutes";
import { settings } from "./infrastructure/frameworks/settings";

const app = express();

app.use(
  cors({
    origin: settings.app.allowedHosts,
  }),
);

app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "Bem-vindo à API do QuimiPort!",
    status: "online",
    ambiente: settings.app.nodeEnv,
  });
});

app.use("/api", exemploRoutes);

app.listen(settings.app.port, settings.app.host, () => {
  console.log(`Servidor rodando em http://${settings.app.host}:${settings.app.port}`);
});