import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
import DataAnalysis from "./pages/DataAnalysis";
import DataAnalysisMultiPage from "./pages/DataAnalysisMultiPage";
import MonteCarloWeeklyPage from "./pages/MonteCarloWeeklyPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/data-analysis/multi" element={<DataAnalysisMultiPage />} />
        <Route path="/data-analysis/:ticker" element={<DataAnalysis />} />
        <Route path="/monte-carlo-weekly/:ticker" element={<MonteCarloWeeklyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;