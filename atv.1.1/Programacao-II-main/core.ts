const filename = __dirname + '/data.todo.json';
let list: string[]  = null!;

async function loadFromFile(){
    if(list !== null)
        return
    try{
        const file = Bun.file(filename);
        const content = await file.text();
        list = JSON.parse(content) as string[];
    }catch(error){
        Bun.write(filename, "[]");
        list = [];
    }
}

async function saveToFile() {
    await Bun.write(filename, JSON.stringify(list));
}

export async function addItem(item:string) {
    await loadFromFile();
    list.push(item);
    await checkFile();
    await saveToFile();
}

export async function getItems() {
    await loadFromFile();
    return list;
}

export async function updateItem(index: number, newItem: string) {
  await loadFromFile(); // Garante que os dados estão carregados em memória
  await checkFile();
  // Verifica se o índice é válido
  if (index < 0 || index >= list.length)
    throw new Error("Índice fora dos limites"); 
  list[index] = newItem; // Atualiza a tarefa no array `list`
  await saveToFile();    // Salva os dados atualizados no arquivo JSON
}

export async function removeItem(index: number) {
  await loadFromFile(); // Garante que os dados estão carregados em memória
  // Verifica se o índice é válido
  if (index < 0 || index >= list.length)
    throw new Error("Índice fora dos limites");
  list.splice(index, 1); // Remove a tarefa do array `list`
  await saveToFile();    // Salva os dados atualizados no arquivo JSON
}

export async function clearItems(){
  list = [];
  await saveToFile(); 

}

function checkFile(item: string) {
  // O .includes() já faz todo o trabalho de procurar o texto na lista!
  if (list.includes(item)) {
      throw new Error("Elemento repetido");
  }
}

export default { addItem, getItems, updateItem, removeItem, clearItems };

//Adicione a capacidade de marcar um item como concluído.