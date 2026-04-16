export class Tarefa {
  constructor(descricao, dataVencimento = null) {
    const textoNormalizado = String(descricao ?? "").trim();

    if (!textoNormalizado) {
      throw new Error("A descricao da tarefa e obrigatoria.");
    }

    this.id = Tarefa.gerarIdUnico();
    this.descricao = textoNormalizado;
    this.dataVencimento = Tarefa.normalizarData(dataVencimento);
    this.concluida = false;
  }

  static gerarIdUnico() {
    return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  }

  static normalizarData(dataVencimento) {
    if (dataVencimento == null || dataVencimento === "") {
      return null;
    }

    const dataTexto = String(dataVencimento).trim();
    const formatoData = /^\d{4}-\d{2}-\d{2}$/;

    if (!formatoData.test(dataTexto)) {
      throw new Error("Data invalida. Use o formato AAAA-MM-DD.");
    }

    const data = new Date(`${dataTexto}T00:00:00`);
    const dataEhValida = !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === dataTexto;

    if (!dataEhValida) {
      throw new Error("Data invalida. Informe uma data existente.");
    }

    return dataTexto;
  }
}
