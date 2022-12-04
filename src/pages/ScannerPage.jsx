import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "react-toastify";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState("");
  const [currOffice, setCurrOffice] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();

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
          return toast.success("Attendance Confirmed");
        } else {
          return toast.error("You are not in this queue");
        }
      }
    })();
  }, [scanResult, currentUser, loading]);

  return (
    <Container maxWidth="md">
      <Typography variant="h5" mb="16px" fontWeight="bold">
        Scan QR Code
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        Please Scan: {currOffice?.peopleInQueue?.[0].id.slice(0, 6)}
      </Typography>
      <QrReader
        onResult={handleScan}
        containerStyle={{ marginTop: -64 }}
        delay={300}
        style={{ width: "100%" }}
      />
    </Container>
  );
};

export default ScannerPage;
