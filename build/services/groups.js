"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.add = exports.getOne = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const events = __importStar(require("./events"));
const prisma = new client_1.PrismaClient();
const getAll = async (id_event) => {
    try {
        return await prisma.eventGroup.findMany({ where: { id_event } });
    }
    catch (err) {
        return false;
    }
};
exports.getAll = getAll;
const getOne = async (filters) => {
    try {
        return await prisma.eventGroup.findFirst({ where: filters });
    }
    catch (err) {
        return false;
    }
};
exports.getOne = getOne;
const add = async (data) => {
    try {
        if (!data.id_event)
            return false;
        const eventItem = await events.getOne(data.id_event);
        if (!eventItem)
            return false;
        return await prisma.eventGroup.create({ data });
    }
    catch (err) {
        return false;
    }
};
exports.add = add;
const update = async (filters, data) => {
    try {
        return await prisma.eventGroup.update({ where: filters, data });
    }
    catch (err) {
        return false;
    }
};
exports.update = update;
const remove = async (filters) => {
    try {
        return await prisma.eventGroup.delete({ where: filters });
    }
    catch (err) {
        return false;
    }
};
exports.remove = remove;
