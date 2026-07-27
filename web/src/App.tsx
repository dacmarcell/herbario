import { Route, Routes } from "react-router-dom";
import ListagemPage from "./pages/ListagemPage";
import DetalhePage from "./pages/DetalhePage";
import CriacaoPage from "./pages/CriacaoPage";
import BanhoPage from "./pages/BanhoPage";
import SassanhaListPage from "./pages/SassanhaListPage";
import SassanhaDetailPage from "./pages/SassanhaDetailPage";
import SassanhaCreationPage from "./pages/SassanhaCreationPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ListagemPage />} />
      <Route path="/nova" element={<CriacaoPage />} />
      <Route path="/folha/:id" element={<DetalhePage />} />
      <Route path="/banho" element={<BanhoPage />} />
      <Route path="/sassanhas" element={<SassanhaListPage />} />
      <Route path="/sassanha/nova" element={<SassanhaCreationPage />} />
      <Route path="/sassanha/:id" element={<SassanhaDetailPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
