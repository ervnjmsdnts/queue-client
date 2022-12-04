import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import userEvent from "@testing-library/user-event";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState("");
  const [currOffice, setCurrOffice] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const handleScan = (result) => {
    if (result) {
      setScanResult(result);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "offices", currentUser.id), (snapshot) => {
      setCurrOffice(snapshot.data());
      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, [currentUser.id]);

  useEffect(() => {
    (async () => {
      if (scanResult && !loading) {
        const result = JSON.parse(scanResult.text);
        const userInQueue = currOffice?.peopleInQueue?.find(
          (q) => q.id === result.id
        );
        if (!!userInQueue) {
          await updateDoc(doc(db, "offices", currentUser.id), {
            peopleInQueue: arrayRemove({ ...userInQueue }),
          });
          await updateDoc(doc(db, "offices", currentUser.id), {
            peopleInQueue: arrayUnion({ ...userInQueue, attendance: true }),
          });
          toast.success("Attendance Confirmed");
          return navigate(-1);
        } else {
          toast.error("You are not in this queue");
          return navigate(-1);
        }
      }
    })();
  }, [scanResult, currentUser, loading]);

  return (
    <Container maxWidth="md">
      <Typography variant="h5" fontWeight="bold">
        Scan QR Code
      </Typography>
      <QrReader onResult={handleScan} delay={300} style={{ width: "100%" }} />
    </Container>
  );
};

export default ScannerPage;
