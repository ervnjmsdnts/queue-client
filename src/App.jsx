import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import UserLayout from "./layouts/UserLayout";
import AuthPage from "./pages/AuthPage";
import UserPage from "./pages/UserPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<AuthPage />} />
        </Route>
        <Route path="/user" element={<UserLayout />}>
          <Route path="" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
