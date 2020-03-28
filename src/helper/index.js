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
  return ((max - min) * Math.random() + min).toFixed(4);
};

const estadosDaFila = [];

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

export const montaTabelaDeDados = (iniciaExecucao, configuracaoInicial) => {
  for (let i = 0; i <= configuracaoInicial.capacidadeDaFila; i++) {
    estadosDaFila.push({
      estado: i,
      tempo: 0
    });
  }

  if (iniciaExecucao) {
    config = configuracaoInicial;
    proximoPasso();
  }
  estadosDaFila.forEach(e => {
    console.log("------------------");
    console.log(`Estado: ${e.estado}`);
    console.log(`Tempo: ${e.tempo.toFixed(4)}`);
    console.log(
      `Probabilidade: ${((e.tempo / tempoGlobal) * 100).toFixed(2)}%`
    );
  });
  console.log("------------------");

  console.log(`Tempo Global: ${tempoGlobal.toFixed(4)}`);
  console.log(
    `Tempo Total dos Estados: ${estadosDaFila
      .map(ev => ev.tempo)
      .reduce((a, b) => a + b)
      .toFixed(4)}`
  );
  console.log(`Número de Perdas: ${PERDAS}`);
  console.log("");
  console.log("Simulação finalizada");
  console.log("###### PARA UMA NOVA SIMULAÇÃO CLIQUE EM RESET ######");
};

export const agendaSaida = tempo => {
  // console.log("Agendou uma saída");
  listaDeEventos.push({ id, tipo: "SAIDA", tempo });
  id = id + 1;
};

export const agendaChegada = tempo => {
  // console.log("Agendou uma chegada");
  listaDeEventos.push({ id, tipo: "CHEGADA", tempo });
  id = id + 1;
};

const contabilizaTempoNoEstado = (nrDeClientesNaFila, tempo) => {
  let index = estadosDaFila.findIndex(e => e.estado === nrDeClientesNaFila);
  let estadoCorrente = estadosDaFila[index];
  estadosDaFila[index] = {
    ...estadoCorrente,
    tempo: estadoCorrente.tempo + tempo
  };
};

export const chegada = (tempoAtual, tempoAnterior) => {
  const deltaT = tempoAtual - tempoAnterior;
  tempoGlobal = tempoGlobal + deltaT;

  contabilizaTempoNoEstado(FILA, deltaT);

  //armazena tempo do evento corrente para ser usado no próximo como anterior
  tempoDoUltimoEvento = tempoAtual;

  if (FILA < config.capacidadeDaFila) {
    FILA = FILA + 1;
    if (FILA <= config.servidores) {
      const tempoSorteioSaida = parseFloat(
        rnd(config.saidaMin, config.saidaMax)
      );
      agendaSaida(tempoGlobal + tempoSorteioSaida);
    }
  } else {
    PERDAS = PERDAS + 1;
  }
  const tempoSorteioChegada = parseFloat(
    rnd(config.chegadaMin, config.chegadaMax)
  );
  agendaChegada(tempoGlobal + tempoSorteioChegada);
  proximoPasso();
};

const saida = (tempoAtual, tempoAnterior) => {
  const deltaT = tempoAtual - tempoAnterior;
  tempoGlobal = tempoGlobal + deltaT;

  contabilizaTempoNoEstado(FILA, deltaT);

  //armazena tempo do evento corrente para ser usado no próximo como anterior
  tempoDoUltimoEvento = tempoAtual;

  FILA = FILA - 1;
  if (FILA >= config.servidores) {
    const tempoSorteioSaida = parseFloat(rnd(config.saidaMin, config.saidaMax));
    agendaSaida(tempoGlobal + tempoSorteioSaida);
  }
  proximoPasso();
};
