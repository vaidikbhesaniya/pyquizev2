"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
function singletonPrismaClient() {
    return new client_1.PrismaClient();
}
const prisma = (_a = globalThis.prismaGlobal) !== null && _a !== void 0 ? _a : singletonPrismaClient();
exports.default = prisma;
if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma;
