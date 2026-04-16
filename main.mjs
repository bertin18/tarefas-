import { TarefaController } from "./src/controller/TarefaController.mjs";

const controller = new TarefaController();

const formNovaTarefa = document.getElementById("nova-tarefa-form");
const inputDescricao = document.getElementById("descricao-tarefa");
const inputData = document.getElementById("data-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");
const mensagem = document.getElementById("mensagem");

let idEmEdicao = null;

function mostrarMensagem(texto, tipo = "erro") {
  mensagem.textContent = texto;
  mensagem.className = tipo === "sucesso" ? "mensagem feedback-sucesso" : "mensagem";
}

function limparMensagem() {
  mensagem.textContent = "";
  mensagem.className = "mensagem";
}

function formatarDataParaExibicao(dataIso) {
  if (!dataIso) {
    return "Sem data definida";
  }

  const [ano, mes, dia] = dataIso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function renderizarLista() {
  const tarefas = controller.listarTarefas();
  listaTarefas.innerHTML = "";

  if (!tarefas.length) {
    const itemVazio = document.createElement("li");
    itemVazio.className = "status-vazio";
    itemVazio.textContent = "Nenhuma tarefa cadastrada ainda.";
    listaTarefas.appendChild(itemVazio);
    return;
  }

  tarefas.forEach((tarefa) => {
    const item = document.createElement("li");
    item.className = "tarefa-item";

    if (tarefa.concluida) {
      item.classList.add("tarefa-concluida");
    }

    if (String(idEmEdicao) === String(tarefa.id)) {
      montarModoEdicao(item, tarefa);
    } else {
      montarModoVisualizacao(item, tarefa);
    }

    listaTarefas.appendChild(item);
  });
}

function montarModoVisualizacao(item, tarefa) {
  const info = document.createElement("div");
  info.className = "tarefa-info";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = tarefa.concluida;
  checkbox.title = "Marcar como concluida";
  checkbox.addEventListener("change", () => {
    controller.alternarConclusao(tarefa.id);
    limparMensagem();
    renderizarLista();
  });

  const textos = document.createElement("div");
  textos.className = "tarefa-textos";

  const descricao = document.createElement("span");
  descricao.className = "tarefa-descricao";
  descricao.textContent = tarefa.descricao;

  const meta = document.createElement("span");
  meta.className = "tarefa-meta";
  meta.textContent = `Vence em: ${formatarDataParaExibicao(tarefa.dataVencimento)}`;

  textos.appendChild(descricao);
  textos.appendChild(meta);

  info.appendChild(checkbox);
  info.appendChild(textos);

  const acoes = document.createElement("div");
  acoes.className = "acoes";

  const botaoEditar = document.createElement("button");
  botaoEditar.type = "button";
  botaoEditar.className = "btn-secundario";
  botaoEditar.textContent = "Editar";
  botaoEditar.addEventListener("click", () => {
    idEmEdicao = tarefa.id;
    limparMensagem();
    renderizarLista();
  });

  const botaoRemover = document.createElement("button");
  botaoRemover.type = "button";
  botaoRemover.className = "btn-remover";
  botaoRemover.textContent = "Remover";
  botaoRemover.addEventListener("click", () => {
    controller.removerTarefa(tarefa.id);

    if (String(idEmEdicao) === String(tarefa.id)) {
      idEmEdicao = null;
    }

    mostrarMensagem("Tarefa removida com sucesso.", "sucesso");
    renderizarLista();
  });

  acoes.appendChild(botaoEditar);
  acoes.appendChild(botaoRemover);

  item.appendChild(info);
  item.appendChild(acoes);
}

function montarModoEdicao(item, tarefa) {
  const areaEdicao = document.createElement("div");
  areaEdicao.className = "edicao-area";

  const inputEdicao = document.createElement("input");
  inputEdicao.type = "text";
  inputEdicao.value = tarefa.descricao;
  inputEdicao.maxLength = 200;
  inputEdicao.setAttribute("aria-label", "Editar descricao da tarefa");

  const inputDataEdicao = document.createElement("input");
  inputDataEdicao.type = "date";
  inputDataEdicao.value = tarefa.dataVencimento ?? "";
  inputDataEdicao.setAttribute("aria-label", "Editar data de vencimento da tarefa");

  const botaoSalvar = document.createElement("button");
  botaoSalvar.type = "button";
  botaoSalvar.textContent = "Salvar";

  const botaoCancelar = document.createElement("button");
  botaoCancelar.type = "button";
  botaoCancelar.className = "btn-secundario";
  botaoCancelar.textContent = "Cancelar";

  const salvarEdicao = () => {
    try {
      controller.atualizarTarefa(tarefa.id, {
        descricao: inputEdicao.value,
        dataVencimento: inputDataEdicao.value
      });
      idEmEdicao = null;
      mostrarMensagem("Tarefa atualizada com sucesso.", "sucesso");
      renderizarLista();
    } catch (erro) {
      mostrarMensagem(erro.message);
      inputEdicao.focus();
      inputEdicao.select();
    }
  };

  botaoSalvar.addEventListener("click", salvarEdicao);
  botaoCancelar.addEventListener("click", () => {
    idEmEdicao = null;
    limparMensagem();
    renderizarLista();
  });

  inputEdicao.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      salvarEdicao();
    }

    if (evento.key === "Escape") {
      idEmEdicao = null;
      limparMensagem();
      renderizarLista();
    }
  });

  areaEdicao.appendChild(inputEdicao);
  areaEdicao.appendChild(inputDataEdicao);
  areaEdicao.appendChild(botaoSalvar);
  areaEdicao.appendChild(botaoCancelar);

  item.appendChild(areaEdicao);

  setTimeout(() => {
    inputEdicao.focus();
    inputEdicao.select();
  }, 0);
}

formNovaTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault();

  try {
    controller.adicionarTarefa(inputDescricao.value, inputData.value);
    inputDescricao.value = "";
    inputData.value = "";
    idEmEdicao = null;
    mostrarMensagem("Tarefa adicionada com sucesso.", "sucesso");
    renderizarLista();
    inputDescricao.focus();
  } catch (erro) {
    mostrarMensagem(erro.message);
    inputDescricao.focus();
  }
});

renderizarLista();
