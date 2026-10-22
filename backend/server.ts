import cors from "cors";
import express from "express";
import cargaQuimicaRoutes from "./interfaces/http/routes/cargaQuimica/cargaQuimicaRoute";
import exemploRoutes from "./interfaces/http/routes/exemploRoutes";
import produtoQuimicoRoutes from "./interfaces/http/routes/produtoQuimico/produtoQuimicoRoute";
import { settings } from "./infrastructure/frameworks/settings";

const app = express();

app.use(
  cors({
    origin: settings.app.allowedHosts,
  }),
);

app.use(express.json());

app.use("/api/cargas", cargaQuimicaRoutes);
app.use("/api/produtos-quimicos", produtoQuimicoRoutes);

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