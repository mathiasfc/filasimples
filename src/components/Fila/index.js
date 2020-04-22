import React, { useEffect, useState } from "react";
import "./style.css";

const Fila = ({
  number,
  chegada1,
  chegada2,
  saida1,
  saida2,
  servers,
  capacidade,
  chegada,
  setConfigFila,
  initial,
}) => {
  const [chegadaMin, setChegadaMin] = useState(chegada1 || 0);
  const [chegadaMax, setChegadaMax] = useState(chegada2 || 0);

  const [saidaMin, setSaidaMin] = useState(saida1 || 0);
  const [saidaMax, setSaidaMax] = useState(saida2 || 0);

  const [servidores, setServidores] = useState(servers || 0);

  const [capacidadeDaFila, setCapacidadeDaFila] = useState(capacidade || 0);

  const [chegadaInicial, setChegadaInicial] = useState(chegada || 0);

  useEffect(() => {
    setConfigFila({
      chegadaMin,
      chegadaMax,
      saidaMin,
      saidaMax,
      servidores,
      capacidadeDaFila,
      chegadaInicial,
    });
  }, [
    chegadaMin,
    chegadaMax,
    saidaMin,
    saidaMax,
    servidores,
    capacidadeDaFila,
    chegadaInicial,
  ]);
  return (
    <div className="Fila">
      <div className="Parameters">
        <span>
          <b>Fila {number}</b> - G/G/{servidores}/{capacidadeDaFila}
          &nbsp;&nbsp;&nbsp;
          {initial && (
            <span>
              Chegada: {chegadaMin}...{chegadaMax} &nbsp;&nbsp;&nbsp;
            </span>
          )}
          Saída: {saidaMin}...{saidaMax}
        </span>
        {initial && (
          <p>
            <span>Intervalo de Chegada: </span>
            <input
              type="number"
              className="NumberInput"
              min="0"
              max="30"
              value={chegadaMin}
              onChange={(e) => setChegadaMin(e.target.value)}
            />
            a
            <input
              type="number"
              className="NumberInput"
              min="0"
              max="30"
              value={chegadaMax}
              onChange={(e) => setChegadaMax(e.target.value)}
            />
          </p>
        )}

        <p>
          <span>Intervalo de Saída: </span>
          <input
            type="number"
            className="NumberInput"
            min="0"
            max="30"
            value={saidaMin}
            onChange={(e) => setSaidaMin(e.target.value)}
          />
          a
          <input
            type="number"
            className="NumberInput"
            min="0"
            max="30"
            value={saidaMax}
            onChange={(e) => setSaidaMax(e.target.value)}
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
            onChange={(e) => setServidores(e.target.value)}
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
            onChange={(e) => setCapacidadeDaFila(e.target.value)}
          />
        </p>
        {initial && (
          <p>
            <span>Chegada Inicial: </span>
            <input
              type="number"
              className="NumberInput"
              min="0"
              max="30"
              value={chegadaInicial}
              onChange={(e) => setChegadaInicial(e.target.value)}
            />
          </p>
        )}
      </div>
    </div>
  );
};

export default Fila;
