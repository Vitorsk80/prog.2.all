import { ToDo, Item } from "./core";

const filepath = "./lista.json";
const todo = new ToDo(filepath);
const port = 3000;

// --- FUNÇÕES DE VALIDAÇÃO ---

function validateItemData(data: any): { Valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { Valid: false, error: "Invalido" };
  }
  if (!data.description || typeof data.description !== 'string') {
    return { Valid: false, error: "Falta uma descrição string" };
  }
  return { Valid: true };
}

function validateIndex(indexStr: string | null): { Valid: boolean; index?: number; error?: string } {
  if (!indexStr) {
    return { Valid: false, error: "Falta um index" };
  }
  const index = parseInt(indexStr);
  if (isNaN(index) || index < 0) {
    return { Valid: false, error: "Index invalido" };
  }
  return { Valid: true, index };
}

// --- CONFIGURAÇÃO DO SERVIDOR ---

const server = Bun.serve({
  port: port,
  async fetch(request: Request) {
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    const jsonHeaders = { "Content-Type": "application/json" };

    if (pathname === "/items" && method === "GET") {
      const items = await todo.getItems();
      const itemsData = items.map(item => item.toJSON());
      return new Response(JSON.stringify(itemsData), { headers: jsonHeaders });
    }

    if (pathname === "/items" && method === "POST") {
      try {
        const body = await request.json();
        const validation = validateItemData(body);

        if (!validation.isValid) {
          return new Response(JSON.stringify({ error: validation.error }), { status: 400, headers: jsonHeaders });
        }

        const item = new Item(body.description);
        await todo.addItem(item);
        
        return new Response(JSON.stringify({ message: "Item added", item: item.toJSON() }), { status: 201, headers: jsonHeaders });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: jsonHeaders });
      }
    }

    if (pathname === "/items" && method === "PUT") {
      try {
        const indexVal = validateIndex(searchParams.get("index"));
        if (!indexVal.isValid) {
          return new Response(JSON.stringify({ error: indexVal.error }), { status: 400, headers: jsonHeaders });
        }

        const body = await request.json();
        const dataVal = validateItemData(body);
        if (!dataVal.isValid) {
          return new Response(JSON.stringify({ error: dataVal.error }), { status: 400, headers: jsonHeaders });
        }

        const item = new Item(body.description);
        await todo.updateItem(indexVal.index!, item);

        return new Response(JSON.stringify({ message: "Updated", item: item.toJSON() }), { headers: jsonHeaders });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Operation failed" }), { status: 500, headers: jsonHeaders });
      }
    }

    if (pathname === "/items" && method === "DELETE") {
      const indexVal = validateIndex(searchParams.get("index"));
      if (!indexVal.isValid) {
        return new Response(JSON.stringify({ error: indexVal.error }), { status: 400, headers: jsonHeaders });
      }

      await todo.removeItem(indexVal.index!);
      return new Response(JSON.stringify({ message: "Removed" }), { headers: jsonHeaders });
    }

    return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: jsonHeaders });
  }
});

console.log(`Servidor rodando em http://localhost:${port}`);