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
exports.doMatches = exports.remove = exports.update = exports.add = exports.getOne = exports.getAll = void 0;
const client_1 = require("@prisma/client");
const people = __importStar(require("./people"));
const match_1 = require("../utils/match");
const prisma = new client_1.PrismaClient();
const getAll = async () => {
    try {
        return await prisma.event.findMany();
    }
    catch (err) {
        return false;
    }
};
exports.getAll = getAll;
const getOne = async (id) => {
    try {
        return await prisma.event.findFirst({ where: { id } });
    }
    catch (err) {
        return false;
    }
};
exports.getOne = getOne;
const add = async (data) => {
    try {
        return await prisma.event.create({ data });
    }
    catch (err) {
        return false;
    }
};
exports.add = add;
const update = async (id, data) => {
    try {
        return await prisma.event.update({ where: { id }, data });
    }
    catch (err) {
        return false;
    }
};
exports.update = update;
const remove = async (id) => {
    try {
        return await prisma.event.delete({ where: { id } });
    }
    catch (err) {
        return false;
    }
};
exports.remove = remove;
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
const doMatches = async (id) => {
    const eventItem = await prisma.event.findFirst({ where: { id }, select: { grouped: true } });
    if (eventItem) { // Verifica se o evento existe
        const peopleList = await people.getAll({ id_event: id }); // Encontre todas as pessoas desse evento
        if (peopleList) { // Se houver pessoas nesse evento
            let sortedList = []; // Mostra o id e o match da pessoa sorteada
            let sortable = []; // Mostra uma lista de pessoas que ainda não foram sorteadas
            let attempts = 0; // Variável que conta quantas vezes eu tentei sortear
            let maxAttempts = peopleList.length; // O número de tentativas sempre será no máximo a quantidade de pessoas que estão no sorteio
            let keepTrying = true; // Controla o número de tentativas
            while (keepTrying && attempts < maxAttempts) { // Enquanto estiver como 'true' continua sorteando mas o número de tentativas não pode ser maior que o valor da variável maxAttempts
                keepTrying = false;
                attempts++;
                sortedList = [];
                sortable = peopleList.map(item => item.id);
                for (let i in peopleList) {
                    let sortableFiltered = sortable;
                    if (eventItem.grouped) {
                        sortableFiltered = sortable.filter(sortableItem => {
                            let sortablePerson = peopleList.find(item => item.id == sortableItem);
                            return peopleList[i].id_group !== sortablePerson?.id_group;
                        });
                    }
                    if (sortableFiltered.length === 0 || (sortableFiltered.length === 1 && peopleList[i].id === sortableFiltered[0])) {
                        keepTrying = true;
                    }
                    else {
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
                    }, { matched: (0, match_1.encryptMatch)(sortedList[i].match) }); // Chama função para ecriptar o sorteado no banco de dados
                }
                return true;
            }
        }
    }
    return false;
};
exports.doMatches = doMatches;
