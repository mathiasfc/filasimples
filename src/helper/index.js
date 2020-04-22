export const createRand = (seed) => {
  var m = 992;
  var a = 11;
  var c = 17;

  var z = seed;

  return function () {
    z = (a * z + c) % m;
    return z / m;
  };
};

let aleatoriosUtilizados = 0;
let t0;
let t1;

const milliTomin = (millis) => {
  const min = Math.floor(millis / 60000);
  const sec = ((millis % 60000) / 1000).toFixed(0);
  return min + ":" + (sec < 10 ? "0" : "") + sec;
};

const rnd = (min, max) => {
  aleatoriosUtilizados = aleatoriosUtilizados + 1;
  min = Math.ceil(min);
  max = Math.floor(max);
  return ((max - min) * Math.random() + min).toFixed(4);
};

const estadosDaFila1 = [];
const estadosDaFila2 = [];

let configFila1 = {};
let configFila2 = {};
let nrAleatorios = 0;
const debuggerMode = false;
const toFixedNr = 8;
//Id para controle de eventos
let id = 1;

//Escalonador
let listaDeEventos = [];

//Número de clientes na fila1
let FILA1 = 0;

//Número de clientes na fila2
let FILA2 = 0;

//Número de perdas na fila 1
let PERDAS1 = 0;

//Número de perdas na fila 2
let PERDAS2 = 0;

//Tempo global de execução
let tempoGlobal = 0;

//Tempo que ocorreu o ultimo evento
let tempoDoUltimoEvento = 0;

const removeEventoDoEscalonador = (evento) => {
  var index = listaDeEventos
    .map((ev) => {
      return ev.id;
    })
    .indexOf(evento.id);

  listaDeEventos.splice(index, 1);
};

const resultados = () => {
  console.log("");
  console.log("");
  console.log("######## FILA 1 ########");
  estadosDaFila1.forEach((e) => {
    console.log(`Estado: ${e.estado}`);
    console.log(`Tempo: ${e.tempo.toFixed(toFixedNr)}`);
    console.log(
      `Probabilidade: ${((e.tempo / tempoGlobal) * 100).toFixed(2)}%`
    );
  });
  console.log("------------------");
  console.log(`Número de Perdas na Fila 1 : ${PERDAS1}`);

  console.log("");
  console.log("");
  console.log("######## FILA 2 ########");
  estadosDaFila2.forEach((e) => {
    console.log(`Estado: ${e.estado}`);
    console.log(`Tempo: ${e.tempo.toFixed(toFixedNr)}`);
    console.log(
      `Probabilidade: ${((e.tempo / tempoGlobal) * 100).toFixed(2)}%`
    );
  });
  console.log("------------------");
  console.log(`Número de Perdas na Fila 2 : ${PERDAS2}`);
  console.log("------------------");
  console.log(`Tempo Global: ${tempoGlobal.toFixed(toFixedNr)}`);

  console.log("");
  console.log("Simulação finalizada");
  console.log("###### PARA UMA NOVA SIMULAÇÃO CLIQUE EM RESET ######");
  t1 = performance.now();
  console.log(`Tempo de Execução ${milliTomin(t1 - t0)}`);
};

//Executa o próximo passo de acordo com o escalonador
const proximoPasso = async () => {
  //condição para finalizar a execução
  if (aleatoriosUtilizados >= nrAleatorios) {
    resultados();
    return;
  }

  let evento = listaDeEventos.reduce(function (res, obj) {
    return obj.tempo < res.tempo ? obj : res;
  });

  removeEventoDoEscalonador(evento);

  debuggerMode &&
    console.log(`(${evento.id}) - ${evento.tipo} / Tempo: ${evento.tempo}`);

  if (evento.tipo === "CHEGADA") {
    chegada(evento.tempo, tempoDoUltimoEvento);
  } else if (evento.tipo === "SAIDA") {
    saida(evento.tempo, tempoDoUltimoEvento);
  } else if (evento.tipo === "P12") {
    passagem12(evento.tempo, tempoDoUltimoEvento);
  }
};

export const montaTabelaDeDados = (iniciaExecucao, configuracaoInicial) => {
  console.log("Executando...");
  t0 = performance.now();

  for (let i = 0; i <= configuracaoInicial.configFila1.capacidadeDaFila; i++) {
    estadosDaFila1.push({
      estado: i,
      tempo: 0,
    });
  }

  for (let i = 0; i <= configuracaoInicial.configFila2.capacidadeDaFila; i++) {
    estadosDaFila2.push({
      estado: i,
      tempo: 0,
    });
  }

  if (iniciaExecucao) {
    nrAleatorios = configuracaoInicial.nrAleatorios;
    configFila1 = configuracaoInicial.configFila1;
    configFila2 = configuracaoInicial.configFila2;
    proximoPasso();
  }
};

export const agendaSaida = (tempoAux) => {
  debuggerMode && console.log("Agendou uma saída");
  let tempo = parseFloat(tempoAux.toFixed(toFixedNr));

  listaDeEventos.push({ id, tipo: "SAIDA", tempo });
  id = id + 1;
};

export const agendaChegada = (tempoAux) => {
  debuggerMode && console.log("Agendou uma chegada");
  let tempo = parseFloat(tempoAux.toFixed(toFixedNr));

  listaDeEventos.push({ id, tipo: "CHEGADA", tempo });
  id = id + 1;
};

export const agendaP12 = (tempoAux) => {
  debuggerMode && console.log("Agendou uma passagem 1 -> 2");
  let tempo = parseFloat(tempoAux.toFixed(toFixedNr));

  listaDeEventos.push({ id, tipo: "P12", tempo });
  id = id + 1;
};

const contabilizaTempoNoEstado = (nrDeClientesNaFila, tempo, fila) => {
  let index;
  let estadoCorrente;

  if (fila === 1) {
    index = estadosDaFila1.findIndex((e) => e.estado === nrDeClientesNaFila);
    estadoCorrente = estadosDaFila1[index];
    estadosDaFila1[index] = {
      ...estadoCorrente,
      tempo: estadoCorrente.tempo + tempo,
    };
  } else if (fila === 2) {
    index = estadosDaFila2.findIndex((e) => e.estado === nrDeClientesNaFila);
    estadoCorrente = estadosDaFila2[index];
    estadosDaFila2[index] = {
      ...estadoCorrente,
      tempo: estadoCorrente.tempo + tempo,
    };
  }
};

export const chegada = (tempoAtual, tempoAnterior) => {
  const deltaT = tempoAtual - tempoAnterior;
  tempoGlobal = tempoGlobal + deltaT;

  contabilizaTempoNoEstado(FILA1, deltaT, 1);
  contabilizaTempoNoEstado(FILA2, deltaT, 2);

  //armazena tempo do evento corrente para ser usado no próximo como anterior
  tempoDoUltimoEvento = tempoAtual;

  if (FILA1 < configFila1.capacidadeDaFila) {
    FILA1 = FILA1 + 1;
    if (FILA1 <= configFila1.servidores) {
      const tempoSorteioSaida = parseFloat(
        rnd(configFila1.saidaMin, configFila1.saidaMax)
      );
      //agenda passagem para Fila 2 P12
      agendaP12(
        parseFloat((tempoGlobal + tempoSorteioSaida).toFixed(toFixedNr))
      );
    }
  } else {
    PERDAS1 = PERDAS1 + 1;
  }
  const tempoSorteioChegada = parseFloat(
    rnd(configFila1.chegadaMin, configFila1.chegadaMax)
  );

  agendaChegada(
    parseFloat((tempoGlobal + tempoSorteioChegada).toFixed(toFixedNr))
  );
  setImmediate(proximoPasso);
};

const passagem12 = (tempoAtual, tempoAnterior) => {
  const deltaT = tempoAtual - tempoAnterior;
  tempoGlobal = tempoGlobal + deltaT;

  contabilizaTempoNoEstado(FILA1, deltaT, 1);
  contabilizaTempoNoEstado(FILA2, deltaT, 2);
  FILA1 = FILA1 - 1;

  if (FILA1 >= configFila1.servidores) {
    const tempoSorteioSaidaDaFila1 = parseFloat(
      rnd(configFila1.saidaMin, configFila1.saidaMax)
    );
    agendaP12(
      parseFloat((tempoGlobal + tempoSorteioSaidaDaFila1).toFixed(toFixedNr))
    );
  }

  if (FILA2 < configFila2.capacidadeDaFila) {
    FILA2 = FILA2 + 1;
    if (FILA2 <= configFila2.servidores) {
      const tempoSorteioSaidaDaFila2 = parseFloat(
        rnd(configFila1.saidaMin, configFila1.saidaMax)
      );

      agendaSaida(
        parseFloat((tempoGlobal + tempoSorteioSaidaDaFila2).toFixed(toFixedNr))
      );
    }
  } else {
    PERDAS2 = PERDAS2 + 1;
  }

  setImmediate(proximoPasso);
};

const saida = (tempoAtual, tempoAnterior) => {
  const deltaT = tempoAtual - tempoAnterior;
  tempoGlobal = tempoGlobal + deltaT;

  contabilizaTempoNoEstado(FILA1, deltaT, 1);
  contabilizaTempoNoEstado(FILA2, deltaT, 2);

  //armazena tempo do evento corrente para ser usado no próximo como anterior
  tempoDoUltimoEvento = tempoAtual;

  FILA2 = FILA2 - 1;
  if (FILA2 >= configFila2.servidores) {
    const tempoSorteioSaida = parseFloat(
      rnd(configFila2.saidaMin, configFila2.saidaMax)
    );

    agendaSaida(
      parseFloat((tempoGlobal + tempoSorteioSaida).toFixed(toFixedNr))
    );
  }

  setImmediate(proximoPasso);
};
