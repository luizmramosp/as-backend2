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
exports.searchPerson = exports.deletePerson = exports.updatePerson = exports.addPerson = exports.getPerson = exports.getAll = void 0;
const people = __importStar(require("../services/people"));
const match = __importStar(require("../utils/match"));
const zod_1 = require("zod");
const getAll = async (req, res) => {
    const { id_event, id_group } = req.params;
    const items = await people.getAll({
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    });
    if (items)
        return res.json({ people: items });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.getAll = getAll;
const getPerson = async (req, res) => {
    const { id, id_event, id_group } = req.params;
    const personItem = await people.getOne({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    });
    if (personItem)
        return res.json({ person: personItem });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.getPerson = getPerson;
const addPerson = async (req, res) => {
    const { id_event, id_group } = req.params;
    const addPersonSchema = zod_1.z.object({
        name: zod_1.z.string(),
        cpf: zod_1.z.string().transform(val => val.replace(/\.|-/gm, ''))
    });
    const body = addPersonSchema.safeParse(req.body);
    if (!body.success)
        return res.json({ error: 'Dados inválidos!' });
    const newPerson = await people.add({
        name: body.data.name,
        cpf: body.data.cpf,
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    });
    if (newPerson)
        return res.status(201).json({ person: newPerson });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.addPerson = addPerson;
const updatePerson = async (req, res) => {
    const { id, id_event, id_group } = req.params;
    const updatePersonSchema = zod_1.z.object({
        name: zod_1.z.string().optional(),
        cpf: zod_1.z.string().transform(val => val.replace(/\.|-/gm, '')).optional(),
        matched: zod_1.z.string().optional()
    });
    const body = updatePersonSchema.safeParse(req.body);
    if (!body.success)
        return res.json({ error: 'Dados inválidos! ' });
    const updatedPerson = await people.update({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    }, body.data);
    if (updatedPerson) {
        const personItem = await people.getOne({
            id: parseInt(id),
            id_event: parseInt(id_event)
        });
        return res.json({ person: personItem });
    }
    ;
    res.json({ error: 'Ocorreu um erro!' });
};
exports.updatePerson = updatePerson;
const deletePerson = async (req, res) => {
    const { id, id_event, id_group } = req.params;
    const deletedPerson = await people.remove({
        id: parseInt(id),
        id_event: parseInt(id_event),
        id_group: parseInt(id_group)
    });
    if (deletedPerson)
        return res.json({ person: deletedPerson });
    res.json({ error: 'Ocorreu um erro!' });
};
exports.deletePerson = deletePerson;
const searchPerson = async (req, res) => {
    const { id_event } = req.params;
    const searchPersonSchema = zod_1.z.object({
        cpf: zod_1.z.string().transform(val => val.replace(/\.|-/gm, ''))
    });
    const query = searchPersonSchema.safeParse(req.query);
    if (!query.success)
        return res.json({ error: 'Dados inválidos' });
    const personItem = await people.getOne({
        id_event: parseInt(id_event),
        cpf: query.data.cpf
    });
    if (personItem && personItem.matched) {
        const matchId = match.decryptMatch(personItem.matched);
        const personMatched = await people.getOne({
            id_event: parseInt(id_event),
            id: matchId
        });
        if (personMatched) {
            return res.json({
                person: {
                    id: personItem.id,
                    name: personItem.name
                },
                personMatched: {
                    id: personMatched.id,
                    name: personMatched.name
                }
            });
        }
    }
    else {
        res.json({ error: 'Ocorreu um erro!' });
    }
};
exports.searchPerson = searchPerson;
