import { PrismaClient, Prisma } from "@prisma/client";
import * as people from './people';
import * as groups from './groups';
import { encryptMatch } from "../utils/match";

const prisma = new PrismaClient();

export const getAll = async () => { // Função para listar todos os eventos
    try {
        return await prisma.event.findMany();
    } catch(err) {
        return false;
    }
}

export const getOne = async (id: number) => { // Função para listar apenas um evento
    try {  
        return await prisma.event.findFirst({ where: { id }});
    } catch(err) {
        return false
    }
}

type EventsCreateData = Prisma.Args<typeof prisma.event, 'create'>['data']; // Função para adicionar um novo evento
export const add = async (data: EventsCreateData) => {
    try {
        return await prisma.event.create({ data });
    } catch(err) {
        return false
    }
}

type EventsUpdateData = Prisma.Args<typeof prisma.event, 'update'>['data']; // Função para atualizar um evento
export const update = async (id: number, data: EventsUpdateData) => {
    try {
        return await prisma.event.update({ where: { id }, data });
    } catch(err) {
        return false
    }
}

export const remove = async (id: number) => { // Função para excluir um evento
    try {
        return await prisma.event.delete({ where: { id }});
    } catch(err) {
        return false
    }
}

  /*
    ID DO EVENTO: 1
    - Grupo A (id: 1)
    -- Luiz
    -- Cris
    -- Maria

    - Grupo B (Id: 2)
    -- João
    -- Pedro
    -- Ana

    - Grupo C (Id: 3)
    -- Bruna
    */

/*
    Pessoa A, Pessoa B, Pessoa C, Pessoa D

    Pessoa A -> Pessoa B
    Pessoa B -> Pessoa C
    Pessoa C -> Pessoa A
    Pessoa D -> ? 

    Pessoa A -> Pessoa C
    Pessoa B -> Pessoa D
    Pessoa C -> Pessoa A
    Pessoa D -> Pessoa B

    Criar um algoritmo que bloqueia algumas situações na hora do sorteio
*/

export const doMatches = async (id: number): Promise<boolean>=> { // Função para fazer o sorteio do evento
    const eventItem = await prisma.event.findFirst({ where: { id }, select: { grouped: true } });

    if (eventItem) { // Verifica se o evento existe
        const peopleList = await people.getAll({ id_event: id }) // Encontre todas as pessoas desse evento
        if(peopleList) { // Se houver pessoas nesse evento
            let sortedList: { id: number, match: number } [] = []; // Mostra o id e o match da pessoa sorteada
            let sortable: number[] = [];// Mostra uma lista de pessoas que ainda não foram sorteadas

            let attempts = 0 // Variável que conta quantas vezes eu tentei sortear
            let maxAttempts = peopleList.length; // O número de tentativas sempre será no máximo a quantidade de pessoas que estão no sorteio
            let keepTrying = true; // Controla o número de tentativas
            while(keepTrying && attempts < maxAttempts ) { // Enquanto estiver como 'true' continua sorteando mas o número de tentativas não pode ser maior que o valor da variável maxAttempts
                keepTrying = false;
                attempts++;
                sortedList = [];
                sortable = peopleList.map(item => item.id)

                for (let i in peopleList) {
                    let sortableFiltered: number[] = sortable;
                    if (eventItem.grouped) {
                        sortableFiltered = sortable.filter(sortableItem => {
                            let sortablePerson = peopleList.find(item => item.id == sortableItem);
                            return peopleList[i].id_group !== sortablePerson?.id_group;
                        });
                    }

                    if (sortableFiltered.length === 0 || (sortableFiltered.length === 1 && peopleList[i].id === sortableFiltered[0])) {
                        keepTrying = true;
                    } else {
                        let sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
                        while (sortableFiltered[sortedIndex] === peopleList[i].id) {
                            sortedIndex = Math.floor(Math.random() * sortableFiltered.length);
                        }

                        sortedList.push({
                            id: peopleList[i].id,
                            match: sortableFiltered[sortedIndex]
                        });
                        sortable = sortable.filter(item => item !== sortableFiltered[sortedIndex]);
                    }
                }
            } 

            console.log(`TENTATIVAS: ${attempts}`);
            console.log(`MÁXIMO DE TENTATIVAS: ${maxAttempts}`);
            console.log(sortedList);

            if (attempts < maxAttempts) { // Caso der tudo certo o sorteio é salvo no banco de dados tudo encriptado
                for (let i in sortedList) {
                    await people.update({
                        id: sortedList[i].id,
                        id_event: id
                    }, { matched: encryptMatch(sortedList[i].match) }); // Chama função para ecriptar o sorteado no banco de dados
                }
                return true;
            }
        }
    }

    return false;
}