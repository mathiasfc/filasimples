import React, { useEffect } from "react";
import Terminal from "terminal-in-react";
import "./App.css";
import { numeroAleatorio } from "./helper";

function App() {
  useEffect(() => {
    console.log("Informe os parâmetros de entrada...");
    // numeroAleatorio();
  }, []);

  return (
    <div className="App">
      <div className="Parameters">
        <p>
          <span>Intervalo de Chegada: </span>
          <input type="number" className="NumberInput" min="0" max="30" /> a
          <input type="number" className="NumberInput" min="0" max="30" />
        </p>
        <p>
          <span>Intervalo de Saída: </span>
          <input type="number" className="NumberInput" min="0" max="30" /> a
          <input type="number" className="NumberInput" min="0" max="30" />
        </p>
        <p>
          <span>Número de servidores: </span>
          <input type="number" className="NumberInput" min="0" max="30" />
        </p>
        <p>
          <span>Capacidade da fila: </span>
          <input type="number" className="NumberInput" min="0" max="30" />
        </p>
        <p>
          <button className="button" style={{ backgroundColor: "#e87e7e" }} onClick={() => console.log("HJUE")}>
            Resetar
          </button>
          <button className="button" style={{ backgroundColor: "#7ee892" }}>
            Simular
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
        commands={{
          "open-google": () => window.open("https://www.google.com/", "_blank")
        }}
      />
    </div>
  );
}

export default App;
