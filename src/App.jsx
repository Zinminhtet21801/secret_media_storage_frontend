import { useState } from "react";
import "./App.css";
import Home from "./pages/Home";
import Nav from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Nav />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
