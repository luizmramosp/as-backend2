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
exports.deleteGroup = exports.updateGroup = exports.addGroup = exports.getGroup = exports.getAll = void 0;
const groups = __importStar(require("../services/groups"));
const zod_1 = require("zod");
const getAll = async (req, res) => {
    const { id_event } = req.params;
    const items = await groups.getAll(parseInt(id_event));
    if (items)
        return res.json({ groups: items });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.getAll = getAll;
const getGroup = async (req, res) => {
    const { id, id_event } = req.params;
    const groupItem = await groups.getOne({
        id: parseInt(id),
        id_event: parseInt(id_event)
    });
    if (groupItem)
        return res.json({ group: groupItem });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.getGroup = getGroup;
const addGroup = async (req, res) => {
    const { id_event } = req.params;
    const addGroupSchema = zod_1.z.object({
        name: zod_1.z.string()
    });
    const body = addGroupSchema.safeParse(req.body);
    if (!body.success)
        return res.json({ error: 'Dados inválidos!' });
    const newGroup = await groups.add({
        name: body.data.name,
        id_event: parseInt(id_event)
    });
    if (newGroup)
        return res.status(201).json({ group: newGroup });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.addGroup = addGroup;
const updateGroup = async (req, res) => {
    const { id, id_event } = req.params;
    const updateGroupSchema = zod_1.z.object({
        name: zod_1.z.string().optional()
    });
    const body = updateGroupSchema.safeParse(req.body);
    if (!body.success)
        return res.json({ error: 'Dados inválidos!' });
    const updatedGroup = await groups.update({
        id: parseInt(id),
        id_event: parseInt(id_event)
    }, body.data);
    if (updatedGroup)
        return res.json({ group: updatedGroup });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.updateGroup = updateGroup;
const deleteGroup = async (req, res) => {
    const { id, id_event } = req.params;
    const deletedGroup = await groups.remove({
        id: parseInt(id),
        id_event: parseInt(id_event)
    });
    if (deletedGroup)
        return res.json({ group: deletedGroup });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.deleteGroup = deleteGroup;
