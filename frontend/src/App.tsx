import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
import DataAnalysisMultiPage from "./pages/DataAnalysisWeeklyMultiPage";
import Indices from "./pages/Indices";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/data-analysis/multi" element={<DataAnalysisMultiPage />} />
        <Route path="/indices" element={<Indices />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;