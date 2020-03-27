export const createRand = seed => {
  var m = 992;
  var a = 11;
  var c = 17;

  var z = seed;

  return function() {
    z = (a * z + c) % m;
    return z / m;
  };
};

let aleatoriosUtilizados = 0;

const rnd = (min, max) => {
  aleatoriosUtilizados = aleatoriosUtilizados + 1;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

let config = {};
//Id para controle de eventos
let id = 1;

//Escalonador
let listaDeEventos = [];

//Número de clientes na fila
let FILA = 0;

//Número de perdas
let PERDAS = 0;

//Tempo global de execução
let tempoGlobal = 0;

//Tempo que ocorreu o ultimo evento
let tempoDoUltimoEvento = 0;

const removeEventoDoEscalonador = evento => {
  var index = listaDeEventos
    .map(ev => {
      return ev.id;
    })
    .indexOf(evento.id);

  listaDeEventos.splice(index, 1);
};

//Executa o próximo passo de acordo com o escalonador
const proximoPasso = () => {
  //condição para finalizar a execução
  if (aleatoriosUtilizados >= config.nrAleatorios) {
    return;
  }

  let evento = listaDeEventos.reduce(function(res, obj) {
    return obj.tempo < res.tempo ? obj : res;
  });

  removeEventoDoEscalonador(evento);

  console.log(`(${evento.id}) - ${evento.tipo} / Tempo: ${evento.tempo}`);
  if (evento.tipo === "CHEGADA") {
    chegada(evento.tempo, tempoDoUltimoEvento);
  } else if (evento.tipo === "SAIDA") {
    saida(evento.tempo, tempoDoUltimoEvento);
  }
};

export const agendaSaida = tempo => {
  console.log("agendou uma saída");
  listaDeEventos.push({ id, tipo: "SAIDA", tempo });
  id = id + 1;
};

export const agendaChegada = (
  tempo,
  iniciaExecucao = false,
  configuracaoInicial
) => {
  console.log("agendou uma chegada");
  listaDeEventos.push({ id, tipo: "CHEGADA", tempo });
  id = id + 1;

  if (iniciaExecucao) {
    config = configuracaoInicial;
    proximoPasso();
  }
};

export const chegada = (tempoAtual, tempoAnterior) => {
  tempoGlobal = tempoAtual - tempoAnterior;
  //armazena tempo do evento corrente para ser usado no próximo como anterior
  tempoAnterior = tempoAtual;

  if (FILA < config.capacidadeDaFila) {
    FILA = FILA + 1;
    if (FILA <= config.servidores) {
      agendaSaida(tempoGlobal + rnd(config.saidaMin, config.saidaMax));
    }
  } else {
    PERDAS = PERDAS + 1;
  }
  agendaChegada(tempoGlobal + rnd(config.chegadaMin, config.chegadaMax));
  proximoPasso();
};

const saida = (tempoAtual, tempoAnterior) => {
  tempoGlobal = tempoAtual - tempoAnterior;
  //armazena tempo do evento corrente para ser usado no próximo como anterior
  tempoAnterior = tempoAtual;

  FILA = FILA - 1;
  if (FILA >= config.servidores) {
    agendaSaida(tempoGlobal + rnd(config.saidaMin, config.saidaMax));
  }
  proximoPasso();
};
