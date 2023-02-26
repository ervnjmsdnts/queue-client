import { Container } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QueueList from "../containers/Office/QueueList";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";

const OfficePage = () => {
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const removeExpiredAppointments = async (officeId) => {
    const now = moment();
    const officeDocRef = doc(db, "offices", officeId);
    const officeDocSnap = await getDoc(officeDocRef);
    if (officeDocSnap.exists()) {
      const officeData = officeDocSnap.data();
      console.log({ officeData });
      const updatedQueue = officeData.peopleInQueue.filter((appointment) => {
        const appointmentTime = moment(appointment.appointmentTime);
        return appointmentTime.isAfter(now);
      });
      await updateDoc(officeDocRef, {
        peopleInQueue: updatedQueue,
      });
    }
  };

  useEffect(() => {
    let timerId = null;

    const startExpirationTimer = async () => {
      try {
        await removeExpiredAppointments(currentUser?.id);

        timerId = setInterval(() => {
          console.log("Test");
          startExpirationTimer();
        }, 15000);
      } catch (error) {
        console.error(error);
      }
    };

    startExpirationTimer();

    return () => {
      clearInterval(timerId);
    };
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser) return navigate("/");
    if (currentUser && currentUser.role === "user") return navigate("/user");
    if (currentUser && currentUser.role === "office")
      return navigate("/office");
    if (currentUser && currentUser.role === "admin") return navigate("/admin");
    if (currentUser && currentUser.role === "organization")
      return navigate("/organization");
  }, [currentUser]);
  return (
    <Container maxWidth="md">
      <QueueList />
    </Container>
  );
};

export default OfficePage;
