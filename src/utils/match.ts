export const encryptMatch = (id: number): string => { // Função para encriptar no banco de dados as pessoas que foram tiradas por cada pessoa
    return `${process.env.DEFAULT_TOKEN}${id}${process.env.DEFAULT_TOKEN}`;
}

export const decryptMatch = (match: string): number =>  { // Função para desencriptar para mostrar quem cada pessoa tirou
    let idString = match
        .replace(`${process.env.DEFAULT_TOKEN}`, '')
        .replace(`${process.env.DEFAULT_TOKEN}`, '');
    return parseInt(idString);
}
