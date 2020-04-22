import React, { useEffect, useState } from "react";
import Terminal from "terminal-in-react";
import { montaTabelaDeDados, agendaChegada } from "./helper";
import "./App.css";
import Fila from "./components/Fila";

function App() {
  useEffect(() => {
    console.log("Informe os parâmetros de entrada.");
    console.log("Clique em Simular para começar a simulação.");
  }, []);

  const [configFila1, setConfigFila1] = useState({});
  const [configFila2, setConfigFila2] = useState({});

  const [nrAleatorios, setNrAleatorios] = useState(8);

  const [btnDisabled, setBtnDisabled] = useState(false);

  let terminalRef = null;

  const iniciaSimulacao = () => {
    setBtnDisabled(true);
    terminalRef.runCommandOnActive("clear");
    const configuracaoInicial = {
      configFila1,
      configFila2,
      nrAleatorios,
    };

    agendaChegada(configFila1.chegadaInicial);
    montaTabelaDeDados(true, configuracaoInicial);
  };

  const resetaSimulacao = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      <div className="Parameters">
        <Fila
          number="1"
          chegada1={2}
          chegada2={3}
          saida1={2}
          saida2={5}
          servers={2}
          capacidade={3}
          chegada={2.5}
          setConfigFila={setConfigFila1}
          initial
        />
        <hr className="divider" />
        <Fila
          number="2"
          saida1={3}
          saida2={5}
          servers={1}
          capacidade={3}
          setConfigFila={setConfigFila2}
        />
        <hr className="divider" />
        <p>
          <span>Aleatórios utilizados: </span>
          <input
            type="number"
            className="NumberInput"
            min="0"
            max="1000"
            value={nrAleatorios}
            onChange={(e) => setNrAleatorios(e.target.value)}
            style={{ width: "80px" }}
          />
        </p>
        <p>
          <button
            className="button green"
            onClick={() => iniciaSimulacao()}
            disabled={btnDisabled}
          >
            Simular
          </button>
          <button className="button red" onClick={() => resetaSimulacao()}>
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
        style={{ fontSize: "22px" }}
        ref={(terminal) => {
          terminalRef = terminal;
        }}
        commands={{
          "open-google": () => window.open("https://www.google.com/", "_blank"),
        }}
      />
    </div>
  );
}

export default App;
