import { Router } from "express";
import * as events from '../controllers/events';
import * as people from '../controllers/people';

const router = Router()

router.get('/ping', (req, res) => res.json({ pong: true}));

router.get('/events/:id', events.getEvent); // Rota para exibir no frontend as informações sobre o evento
router.get('/events/:id_event/search', people.searchPerson); // Rota para buscar a pessa que foi sorteada e exibir no frontend

export default router;
