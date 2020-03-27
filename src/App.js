import React, { useEffect, useState } from "react";
import Terminal from "terminal-in-react";
import { agendaChegada } from "./helper";
import "./App.css";

function App() {
  useEffect(() => {
    console.log("Informe os parâmetros de entrada.");
    console.log("Clique em iniciar para começar a simulação.");
    console.log("Obs: limite de 1000 número aleatórios");
  }, []);

  const [chegadaMin, setChegadaMin] = useState(2);
  const [chegadaMax, setChegadaMax] = useState(4);

  const [saidaMin, setSaidaMin] = useState(3);
  const [saidaMax, setSaidaMax] = useState(5);

  const [servidores, setServidores] = useState(1);

  const [capacidadeDaFila, setCapacidadeDaFila] = useState(5);

  const [chegadaInicial, setChegadaInicial] = useState(3);

  const [nrAleatorios, setNrAleatorios] = useState(1000);

  let terminalRef = null;

  const iniciaSimulacao = () => {
    terminalRef.runCommandOnActive("clear");
    const configuracaoInicial = {
      chegadaMin,
      chegadaMax,
      saidaMin,
      saidaMax,
      servidores,
      capacidadeDaFila,
      nrAleatorios
    };
    agendaChegada(chegadaInicial, true, configuracaoInicial);
  };

  const resetaSimulacao = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      <div className="Parameters">
        <p>
          <span>Intervalo de Chegada: </span>
          <input
            type="number"
            className="NumberInput"
            min="0"
            max="30"
            value={chegadaMin}
            onChange={e => setChegadaMin(e.target.value)}
          />
          a
          <input
            type="number"
            className="NumberInput"
            min="0"
            max="30"
            value={chegadaMax}
            onChange={e => setChegadaMax(e.target.value)}
          />
        </p>
        <p>
          <span>Intervalo de Saída: </span>
          <input
            type="number"
            className="NumberInput"
            min="0"
            max="30"
            value={saidaMin}
            onChange={e => setSaidaMin(e.target.value)}
          />
          a
          <input
            type="number"
            className="NumberInput"
            min="0"
            max="30"
            value={saidaMax}
            onChange={e => setSaidaMax(e.target.value)}
          />
        </p>
        <p>
          <span>Número de servidores: </span>
          <input
            type="number"
            className="NumberInput"
            min="0"
            max="30"
            value={servidores}
            onChange={e => setServidores(e.target.value)}
          />
        </p>
        <p>
          <span>Capacidade da fila: </span>
          <input
            type="number"
            className="NumberInput"
            min="0"
            max="30"
            value={capacidadeDaFila}
            onChange={e => setCapacidadeDaFila(e.target.value)}
          />
        </p>

        <p>
          <span>Chegada Inicial: </span>
          <input
            type="number"
            className="NumberInput"
            min="0"
            max="30"
            value={chegadaInicial}
            onChange={e => setChegadaInicial(e.target.value)}
          />
        </p>

        <p>
          <span>Aleatórios utilizados: </span>
          <input
            type="number"
            className="NumberInput"
            min="0"
            max="1000"
            value={nrAleatorios}
            onChange={e => setNrAleatorios(e.target.value)}
            style={{ width: "80px" }}
          />
        </p>
        <p>
          <button
            className="button"
            style={{ backgroundColor: "#7ee892" }}
            onClick={() => iniciaSimulacao()}
          >
            Simular
          </button>
          <button
            className="button"
            style={{ backgroundColor: "#e87e7e" }}
            onClick={() => resetaSimulacao()}
          >
            Reset
          </button>
        </p>
      </div>

      <Terminal
        watchConsoleLogging
        startState="maximised"
        hideTopBar
        color="white"
        prompt="white"
        allowTabs={false}
        ref={terminal => {
          terminalRef = terminal;
        }}
        commands={{
          "open-google": () => window.open("https://www.google.com/", "_blank")
        }}
      />
    </div>
  );
}

export default App;
