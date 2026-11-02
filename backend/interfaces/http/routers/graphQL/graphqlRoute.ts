import { Router, Request, Response } from "express";
import { cargaQuimicaRepository } from "../../../../src/container";
import { normalizarStatusCarga } from "../../../../src/domain/entities/statusCarga";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { query, variables } = req.body || {};

  if (!query || typeof query !== "string") {
    return res.status(400).json({
      errors: [{ message: "Consulta GraphQL ausente. Envie a propriedade 'query' no corpo JSON." }],
    });
  }

  try {
    if (query.includes("cargasPorStatus")) {
      const statusAlvo = variables?.status;
      const statusNormalizado = normalizarStatusCarga(statusAlvo);

      if (!statusNormalizado) {
        return res.status(400).json({
          errors: [
            {
              message: `Status inválido fornecido: "${statusAlvo}". Use um status válido como 'Registrada', 'Em análise', 'Em inspeção', 'Liberada', 'Bloqueada', 'Em movimentação', 'Finalizada' ou 'Cancelada'.`,
            },
          ],
        });
      }

      const todasCargas = await cargaQuimicaRepository.listar();
      const filtradas = todasCargas.filter(
        (c: any) => normalizarStatusCarga(c.status) === statusNormalizado
      );

      return res.status(200).json({
        data: {
          cargasPorStatus: filtradas.map((c: any) => ({
            id: c.id,
            codigo: c.codigo,
            nome: c.nome,
            status: c.status,
            quantidade: c.quantidade,
            unidadeMedida: c.unidadeMedida,
            responsavelTecnico: c.responsavelTecnico,
            produtoQuimico: c.produtoQuimico,
          })),
        },
      });
    }

    if (query.includes("__schema")) {
      return res.status(200).json({
        data: {
          __schema: {
            queryType: {
              name: "Query",
              fields: [
                {
                  name: "cargasPorStatus",
                  description: "Consulta demonstrativa de cargas químicas por status",
                },
              ],
            },
          },
        },
      });
    }

    return res.status(400).json({
      errors: [
        {
          message:
            "Query GraphQL não reconhecida nesta rota demonstrativa. Query suportada: cargasPorStatus(status: String!)",
        },
      ],
    });
  } catch (error: any) {
    return res.status(500).json({
      errors: [{ message: error.message || "Erro interno ao processar query GraphQL demonstrativa" }],
    });
  }
});

export default router;
