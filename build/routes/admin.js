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
const express_1 = require("express");
const auth = __importStar(require("../controllers/auth"));
const events = __importStar(require("../controllers/events"));
const groups = __importStar(require("../controllers/groups"));
const people = __importStar(require("../controllers/people"));
const router = (0, express_1.Router)();
router.get('/ping', auth.validate, (req, res) => res.json({ pong: true, admin: true }));
router.post('/login', auth.login);
router.get('/events', auth.validate, events.getAll); // Rota para listar todos os eventos
router.get('/events/:id', auth.validate, events.getEvent); // Rota para listar apenas um evento
router.post('/events', auth.validate, events.addEvent); // Rota para adicionar um novo evento
router.put('/events/:id', auth.validate, events.updateEvent); // Rota para atualizar um evento
router.delete('/events/:id', auth.validate, events.deleteEvent); // Rota para excluir um evento
router.get('/events/:id_event/groups', auth.validate, groups.getAll); // Rota para listar todos os grupos do evento X
router.get('/events/:id_event/groups/:id', auth.validate, groups.getGroup); // Rota para listar apenas um grupo do evento X
router.post('/events/:id_event/groups', auth.validate, groups.addGroup); // Rota para adicionar um novo grupo do evento X
router.put('/events/:id_event/groups/:id', auth.validate, groups.updateGroup); // Rota para atualizar um grupo do evento X
router.delete('/events/:id_event/groups/:id', auth.validate, groups.deleteGroup); // Rota para excluir um grupo do evento X
router.get('/events/:id_event/groups/:id_group/people', auth.validate, people.getAll); // Rota para listar todas as pessoas de um evento X e de um grupo X
router.get('/events/:id_event/groups/:id_group/people/:id', auth.validate, people.getPerson); // Rota para listar apenas uma pessoa de um evento X e de um grupo X
router.post('/events/:id_event/groups/:id_group/people', auth.validate, people.addPerson); // Rota para adicionar pessoas em um evento X e em um grupo X
router.put('/events/:id_event/groups/:id_group/people/:id', auth.validate, people.updatePerson); // Rota para atualzar uma pessoa de um evento X e de um grupo X
router.delete('/events/:id_event/groups/:id_group/people/:id', auth.validate, people.deletePerson); // Rota para excluir uma pessoa de um evento X e de um grupo X
exports.default = router;
