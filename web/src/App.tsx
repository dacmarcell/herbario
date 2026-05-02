import { Route, Routes } from "react-router-dom";
import ListagemPage from "./pages/ListagemPage";
import DetalhePage from "./pages/DetalhePage";
import CriacaoPage from "./pages/CriacaoPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListagemPage />} />
      <Route path="/nova" element={<CriacaoPage />} />
      <Route path="/folha/:id" element={<DetalhePage />} />
    </Routes>
  );
}

export default App;
