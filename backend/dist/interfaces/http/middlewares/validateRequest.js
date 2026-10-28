"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const zod_1 = require("zod");
function validateRequest(schemas) {
    return async (req, res, next) => {
        try {
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query);
            }
            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params);
            }
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    erro: "Dados de requisição inválidos",
                    detalhes: error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(", "),
                });
            }
            return res.status(400).json({
                erro: "Falha na validação da requisição",
            });
        }
    };
}
