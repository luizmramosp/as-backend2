import { Router } from "express";
import * as auth from '../controllers/auth';
import * as events from '../controllers/events';
import * as groups from '../controllers/groups';
import * as people from '../controllers/people';

const router = Router();

router.get('/ping', auth.validate, (req, res) => res.json({ pong: true, admin:true }));
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

export default router;