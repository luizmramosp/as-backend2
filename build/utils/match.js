"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptMatch = exports.encryptMatch = void 0;
const encryptMatch = (id) => {
    return `${process.env.DEFAULT_TOKEN}${id}${process.env.DEFAULT_TOKEN}`;
};
exports.encryptMatch = encryptMatch;
const decryptMatch = (match) => {
    let idString = match
        .replace(`${process.env.DEFAULT_TOKEN}`, '')
        .replace(`${process.env.DEFAULT_TOKEN}`, '');
    return parseInt(idString);
};
exports.decryptMatch = decryptMatch;
