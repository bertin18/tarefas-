const CHAVE_TAREFAS = "tarefas";

export class TarefaService {
  salvarTodas(tarefas) {
    localStorage.setItem(CHAVE_TAREFAS, JSON.stringify(tarefas));
  }

  buscarTodas() {
    const tarefasSalvas = localStorage.getItem(CHAVE_TAREFAS);

    if (!tarefasSalvas) {
      return [];
    }

    try {
      const tarefas = JSON.parse(tarefasSalvas);
      return Array.isArray(tarefas) ? tarefas : [];
    } catch (erro) {
      console.error("Erro ao ler tarefas do localStorage:", erro);
      return [];
    }
  }
}
