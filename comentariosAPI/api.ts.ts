import todo from "./core.ts"; //importa a lógica para o banco

const server = Bun.serve({
  port: 3000, //inicia o serrver na porta 3000

  routes: {
    "/": new Response(Bun.file("./public/index.html")), // o "/" significa que o index.html será aberto por padrão

    "/api/todo": { 
      GET: async () => {  //lista os dados do todo de forma assincrona
        const items = await todo.getItems() //espera os valores dos items serem pegos e armazena em uma constante
        return Response.json(items) //retorna os dados em .json 
      },

      POST: async (req) => {
        const data = await req.json() as any; //espera uma requisição com qualquer valor e o armazena na const
        const item = data.item || null; //pega o valor .item da const data e o armazena na const item
        if (!item) //se não tiver um item irá dar erro e requirir um novo item
          return Response.json('Por favor, forneça um item para adicionar.', { status: 400 });
        await todo.addItem(item); //chama a função add item do todo e adiciona o item que foi informado
        return Response.json(data); //retorna os dados em .json 
      },
    },

    "/api/todo/:index": {
      PUT: async (req) => {
        const index = parseInt(req.params.index); //analisa o index dos params e o torna em int
        if (isNaN(index)) 
          return Response.json('Índice inválido. um número inteiro é esperado.', { status: 400 }); //se o index não for um número retorna um erro esperando um número inteiro
        const data = await req.json() as any; // pega toda a requisição em cadastra em data
        const newItem = data.newItem || null; //pega o valor newItem dos dados e guarda na const
        if (!newItem) // se não tiver um novo item pede um novo item
          return Response.json('Por favor, forneça um novo item para atualizar.', { status: 400 });
        try {
          await todo.updateItem(index, newItem); // espera a função update Item do todo e atualiza com o index e o novo item
          return Response.json(`Item no índice ${index} atualizado para "${newItem}".`);  //retorna em string ou .json e informa o sucesso
        } catch (error: any) {
          return Response.json(error.message, { status: 400 }); //se houver um erro da status 400
        }
      },

      DELETE: async (req) => {
        const index = parseInt(req.params.index); //busca o index do item que foi informado, transforma em int e armazena no const index
        if (isNaN(index)) // se o index não for um número retorna erro 400
          return Response.json('Índice inválido.', { status: 400 });
        try {
          await todo.removeItem(index); //tenta usar o index e chama a função do todo para remover o index com base no index
          return Response.json(`Item no índice ${index} removido com sucesso.`); // informa o sucesso novamente
        } catch (error: any) {
          return Response.json(error.message, { status: 400 }); // se houver algum erro com o index por exemplo, retorna erro 400
        }
      },
    },

    // EXEMPLO BÁSICO

    "/api/exemplo": {
      GET: () => {
        return new Response(`Esse é o exemplo: ${Date.now()}`)
      },

      POST: async (req) => {
        const data = await req.json() as any;
        data.recebidoEm = new Date().toLocaleDateString("pt-BR");
        return Response.json(data);
      },
    },

    "/api/exemplo/:id": {
      PUT: async (req, params) => {
        const { id } = req.params;
        const data = await req.json() as any;
        data.id = id;
        data.recebidoEm = new Date().toLocaleDateString("pt-BR");
        return Response.json(data);
      },

      PATCH: async (req, params) => {
        const { id } = req.params;
        const data = await req.json() as any;
        data.chavesAtualizadas = Object.keys(data);
        data.id = id;
        data.atualizadoEm = new Date().toLocaleDateString("pt-BR");
        return Response.json(data);
      },

      DELETE: (req, params) => {
        const { id } = req.params;
        return new Response(`Recurso com id ${id} deletado`, { status: 200 });
      }
    }
    // FIM DO EXEMPLO BÁSICO
  },

  async fetch(req) {
    return new Response(`Not Found`, { status: 404 }); // se a requisição não for nenhuma das de cima retorna erro 400
  },
});

console.log(`Server running at http://localhost:${server.port}`); // pra ficar sabido né
