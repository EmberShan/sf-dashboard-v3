import { useState } from "react";
import "./App.css";
import Catalogue from "@/components/Catalogue";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app bg-background-color">
      <div className="w-full bg-background p-24">
        <Catalogue />
      </div>
    </div>
  );
}

export default App;
