export class Tarefa {
  constructor(descricao) {
    const textoNormalizado = String(descricao ?? "").trim();

    if (!textoNormalizado) {
      throw new Error("A descricao da tarefa e obrigatoria.");
    }

    this.id = Tarefa.gerarIdUnico();
    this.descricao = textoNormalizado;
    this.concluida = false;
  }

  static gerarIdUnico() {
    return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  }
}
