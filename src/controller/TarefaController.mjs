import { Tarefa } from "../model/Tarefa.mjs";
import { TarefaService } from "../service/TarefaService.mjs";

export class TarefaController {
  constructor() {
    this.service = new TarefaService();
    this.tarefas = this.service.buscarTodas().map((tarefa) => this.#normalizar(tarefa));
  }

  adicionarTarefa(descricao) {
    const textoNormalizado = String(descricao ?? "").trim();

    if (!textoNormalizado) {
      throw new Error("Digite uma descricao valida para a tarefa.");
    }

    const novaTarefa = new Tarefa(textoNormalizado);
    this.tarefas.push(novaTarefa);
    this.#persistir();

    return { ...novaTarefa };
  }

  listarTarefas() {
    return this.tarefas.map((tarefa) => ({ ...tarefa }));
  }

  atualizarTarefa(id, novosDados) {
    const indice = this.#encontrarIndicePorId(id);

    if (indice === -1) {
      throw new Error("Tarefa nao encontrada.");
    }

    const novaDescricao = String(novosDados?.descricao ?? "").trim();

    if (!novaDescricao) {
      throw new Error("A descricao da tarefa nao pode ficar vazia.");
    }

    const tarefaAtual = this.tarefas[indice];
    this.tarefas[indice] = {
      ...tarefaAtual,
      descricao: novaDescricao
    };

    this.#persistir();
    return { ...this.tarefas[indice] };
  }

  removerTarefa(id) {
    const indice = this.#encontrarIndicePorId(id);

    if (indice === -1) {
      return false;
    }

    this.tarefas.splice(indice, 1);
    this.#persistir();
    return true;
  }

  alternarConclusao(id) {
    const indice = this.#encontrarIndicePorId(id);

    if (indice === -1) {
      throw new Error("Tarefa nao encontrada.");
    }

    const tarefaAtual = this.tarefas[indice];
    this.tarefas[indice] = {
      ...tarefaAtual,
      concluida: !tarefaAtual.concluida
    };

    this.#persistir();
    return { ...this.tarefas[indice] };
  }

  #persistir() {
    this.service.salvarTodas(this.tarefas);
  }

  #encontrarIndicePorId(id) {
    return this.tarefas.findIndex((tarefa) => String(tarefa.id) === String(id));
  }

  #normalizar(tarefa) {
    return {
      id: tarefa?.id ?? Tarefa.gerarIdUnico(),
      descricao: String(tarefa?.descricao ?? "").trim(),
      concluida: Boolean(tarefa?.concluida)
    };
  }
}
