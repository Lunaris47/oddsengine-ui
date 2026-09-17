import { useState } from "react";
import Converter from "./calculators/Converter";
import NoVig from "./calculators/NoVig";
import Parlay from "./calculators/Parlay";
import Ev from "./calculators/Ev";
import Kelly from "./calculators/Kelly";
import Hedge from "./calculators/Hedge";
import Arbitrage from "./calculators/Arbitrage";
import "./App.css";

const TABS = [
  { id: "converter", label: "Converter", Component: Converter },
  { id: "novig", label: "No-Vig", Component: NoVig },
  { id: "parlay", label: "Parlay", Component: Parlay },
  { id: "ev", label: "EV", Component: Ev },
  { id: "kelly", label: "Kelly", Component: Kelly },
  { id: "hedge", label: "Hedge", Component: Hedge },
  { id: "arbitrage", label: "Arbitrage", Component: Arbitrage },
];

export default function App() {
  const [active, setActive] = useState("converter");
  const Active = TABS.find((t) => t.id === active).Component;

  return (
    <main>
      <header>
        <h1>OddsEngine</h1>
        <p>Betting math calculators</p>
      </header>
      
      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={t.id === active ? "tab active" : "tab"}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <Active />
    </main>
  );
}