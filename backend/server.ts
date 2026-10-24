import cors from "cors";
import express from "express";
import cargaQuimicaRouter from "./interfaces/http/routers/cargaQuimica/cargaQuimicaRoute";
// import exemploRoutes from "./interfaces/http/routes/exemploRoutes";
import produtoQuimicoRouter from "./interfaces/http/routers/produtoQuimico/produtoQuimicoRoute";
import { settings } from "./infrastructure/frameworks/settings";

// Routers
import routerUser from "./interfaces/http/routers/users/users";

const app = express();

app.use(
  cors({
    origin: settings.app.allowedHosts,
  }),
);

// Express Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Bem-vindo à API do QuimiPort!",
    status: "online",
    ambiente: settings.app.nodeEnv,
  });
});

app.use("/api/usuarios", routerUser);
app.use("/api/cargas", cargaQuimicaRouter);
app.use("/api/produtos-quimicos", produtoQuimicoRouter);

// app.use("/api", exemploRoutes);

app.listen(settings.app.port, settings.app.host, () => {
  console.log(`Servidor rodando em http://${settings.app.host}:${settings.app.port}`);
});