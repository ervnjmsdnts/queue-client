import { Container } from "@mui/material";
import OrganizationTable from "../containers/Admin/OrganizationTable";

const AdminPage = () => {
  return (
    <Container maxWidth="md">
      <OrganizationTable />
    </Container>
  );
};

export default AdminPage;
