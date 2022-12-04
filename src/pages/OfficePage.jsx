import { Container } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QueueList from "../containers/Office/QueueList";
import useAuth from "../hooks/useAuth";

const OfficePage = () => {
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return navigate("/");
    if (currentUser && currentUser.role === "user") return navigate("/user");
    if (currentUser && currentUser.role === "office")
      return navigate("/office");
    if (currentUser && currentUser.role === "admin") return navigate("/admin");
  }, [currentUser]);
  return (
    <Container maxWidth="md">
      <QueueList />
    </Container>
  );
};

export default OfficePage;
