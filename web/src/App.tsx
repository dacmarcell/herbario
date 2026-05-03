import { Route, Routes } from "react-router-dom";
import ListagemPage from "./pages/ListagemPage";
import DetalhePage from "./pages/DetalhePage";
import CriacaoPage from "./pages/CriacaoPage";
import BanhoPage from "./pages/BanhoPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListagemPage />} />
      <Route path="/nova" element={<CriacaoPage />} />
      <Route path="/folha/:id" element={<DetalhePage />} />
      <Route path="/banho" element={<BanhoPage />} />
    </Routes>
  );
}

export default App;
