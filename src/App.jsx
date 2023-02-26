import { Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import OfficeLayout from "./layouts/OfficeLayout";
import StaffLayout from "./layouts/StaffLayout";
import UserLayout from "./layouts/UserLayout";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import OfficePage from "./pages/OfficePage";
import OrganizationPage from "./pages/OrganizationPage";
import ScannerPage from "./pages/ScannerPage";
import UserPage from "./pages/UserPage";

const App = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<AuthPage />} />
      </Route>
      <Route path="/user" element={<UserLayout />}>
        <Route path="" element={<UserPage />} />
      </Route>
      <Route element={<StaffLayout />}>
        <Route path="/admin">
          <Route path="" element={<AdminPage />} />
        </Route>
      </Route>
      <Route element={<OfficeLayout />}>
        <Route path="/organization" element={<OrganizationPage />} />
        <Route path="/office" element={<OfficePage />} />
        <Route path="/scan" element={<ScannerPage />} />
      </Route>
    </Routes>
  );
};

export default App;
