import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import routes from "tempo-routes";
import AppRoutes from "./routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <AppRoutes />
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
