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
exports.deleteEvent = exports.updateEvent = exports.addEvent = exports.getEvent = exports.getAll = void 0;
const events = __importStar(require("../services/events"));
const people = __importStar(require("../services/people"));
const zod_1 = require("zod");
const getAll = async (req, res) => {
    const items = await events.getAll();
    if (items)
        return res.json({ events: items });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.getAll = getAll;
const getEvent = async (req, res) => {
    const { id } = req.params;
    const eventItem = await events.getOne(parseInt(id));
    if (eventItem)
        return res.json({ eventItem });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.getEvent = getEvent;
const addEvent = async (req, res) => {
    const addEventSchema = zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        grouped: zod_1.z.boolean()
    });
    const body = addEventSchema.safeParse(req.body);
    if (!body.success)
        return res.json({ error: 'Dados inválidos!' });
    const newEvent = await events.add(body.data);
    if (newEvent)
        return res.status(201).json({ event: newEvent });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.addEvent = addEvent;
const updateEvent = async (req, res) => {
    const { id } = req.params;
    const updateEventSchema = zod_1.z.object({
        status: zod_1.z.boolean().optional(),
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        grouped: zod_1.z.boolean().optional()
    });
    const body = updateEventSchema.safeParse(req.body);
    if (!body.success)
        return res.json({ error: 'Dados inválidos!' });
    const updatedEvent = await events.update(parseInt(id), body.data);
    if (updatedEvent) {
        if (updatedEvent.status) {
            // Fazer o sorteio
            const result = await events.doMatches(parseInt(id));
            if (!result) {
                return res.json({ error: 'Grupos impossíveis de sortear!' });
            }
        }
        else {
            // Limpar o sorteio
            await people.update({ id_event: parseInt(id) }, { matched: '' });
        }
        return res.json({ event: updatedEvent });
    }
    res.json({ error: 'Ocorreu um erro!' });
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res) => {
    const { id } = req.params;
    const deletedEvent = await events.remove(parseInt(id));
    if (deletedEvent)
        return res.json({ event: deletedEvent });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.deleteEvent = deleteEvent;
