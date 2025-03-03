import Calendario from "./components/genCalendario.jsx";
import { useState } from "react";

function App() {
  return (
    <Calendario />
  )
}

function login() {
  const [user, setUser] = useState('1');

  if (user === 1) {
    return <Calendario />
  } else {
    return <Calendario />
  }

}

export default App;