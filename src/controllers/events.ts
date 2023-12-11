import { RequestHandler } from "express";
import * as events from '../services/events';
import * as people from '../services/people';
import { z } from "zod";

export const getAll: RequestHandler = async (req, res) => { // Função para listar todos os eventos
    const items = await events.getAll();
    if (items) return res.json({ events: items });

    res.json({ error: 'Ocorreu um erro!' });
}

export const getEvent: RequestHandler = async (req, res) => {  // Função para listar apenas um evento
    const { id } = req.params;
    const eventItem = await events.getOne(parseInt(id));
    if (eventItem) return res.json({ eventItem });

    res.json({ error: 'Ocorreu um erro!' });
}

export const addEvent: RequestHandler = async (req, res) => { // Função para adicionar um novo evento
    const addEventSchema = z.object({
        title: z.string(),
        description: z.string(),
        grouped: z.boolean()
    });
    const body = addEventSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: 'Dados inválidos!' });

    const newEvent = await events.add(body.data);
    if (newEvent) return res.status(201).json({ event: newEvent });

    res.json({ error: 'Ocorreu um erro!' });
}

export const updateEvent: RequestHandler = async (req, res) => { // Função para atualizar um evento
    const { id } = req.params;
    const updateEventSchema = z.object({
        status: z.boolean().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        grouped: z.boolean().optional()
    })
    const body = updateEventSchema.safeParse(req.body);
    if (!body.success) return res.json({ error: 'Dados inválidos!'});

    const updatedEvent = await events.update(parseInt(id), body.data);
    if (updatedEvent) {
        if (updatedEvent.status) {
            // Fazer o sorteio
            const result = await events.doMatches(parseInt(id));
            if(!result) {
                return res.json({ error: 'Grupos impossíveis de sortear!'});
            }
        } else  {
            // Limpar o sorteio
            await people.update({ id_event: parseInt(id) }, { matched: '' });
        }

        return res.json({ event: updatedEvent });
    }

    res.json({ error: 'Ocorreu um erro!' });
}

export const deleteEvent: RequestHandler =async (req, res) => { // Função para excluir um evento
    const { id } = req.params;

    const deletedEvent = await events.remove(parseInt(id));
    if (deletedEvent) return res.json({ event: deletedEvent });

    res.json({ error: 'Ocorreu um erro!' });
}