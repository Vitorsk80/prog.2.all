import { ToDo, Item } from './core.ts';

const file = process.argv[2]
const command = process.argv[3];

if (!file) {
    console.error("Por favor, forneça o caminho do arquivo.");
    process.exit(1);
}

const todo = new ToDo(file);

if (command === "add") {
    const itemDescription = process.argv[4];

    if (!itemDescription) {
        console.error("Por favor, forneça uma descrição para o item.");
        process.exit(1);
    }

    const item = new Item(itemDescription);
    await todo.addItem(item);
    console.log(`Item "${itemDescription}" adicionado com sucesso!`);
    process.exit(0);
}

if (command === "list") {
    const items = await todo.getItems();

    if (items.length === 0) {
        console.error("Nenhum item na lista.");
        process.exit(1);
    }

    console.log("Lista de itens:");
    items.forEach((item, index) => console.log(`${index}: ${item.toJSON().description}`));
    process.exit(0);
}

if (command === "update") {
    const index:number = process.argv[4];
    const itemDescription = process.argv[5];

    if (itemDescription === undefined || isNaN(index)) {
        console.error("O comando é: bun clit.ts update [index] [descrição]");
        process.exit(1);
    }

    await todo.updateItem(index, new Item(itemDescription));
    console.log(`O item: ${itemDescription}, de index: ${index}, foi atualizado`);
    process.exit(0);
}

if (command === "remove") {
    const index = Number(process.argv[4]);

    if (!index) {
        console.error("Por favor forneça um index válido");
        process.exit(1);
    }

    await todo.removeItem(index);
    console.log(`O item ${index} foi removido`);
    process.exit(0);
}

console.error("Comando desconhecido. Use 'add', 'list', 'update' ou 'remove'.");
process.exit(1);