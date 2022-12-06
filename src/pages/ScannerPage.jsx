import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "react-toastify";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import _ from "lodash";
const ScannerPage = () => {
  const [scanResult, setScanResult] = useState("");
  const [currOffice, setCurrOffice] = useState([]);

  const { currentUser } = useAuth();

  const handleScan = useCallback(
    (result) => {
      if (result) {
        if (_.isEqual(result, scanResult)) return;
        setScanResult(result);
      }
    },
    [scanResult]
  );

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "offices", currentUser.id), (snapshot) => {
      setCurrOffice(snapshot.data());
    });

    return () => {
      unsub();
    };
  }, [currentUser.id]);

  useEffect(() => {
    const scanning = async () => {
      if (scanResult && currOffice) {
        const result = JSON.parse(scanResult.text);
        const userInQueue = currOffice?.peopleInQueue?.find(
          (q) => q.id === result.id
        );
        if (!!userInQueue) {
          if (userInQueue.attendance) return;
          await updateDoc(doc(db, "offices", currentUser.id), {
            peopleInQueue: arrayRemove({ ...userInQueue }),
          });
          await updateDoc(doc(db, "offices", currentUser.id), {
            peopleInQueue: arrayUnion({ ...userInQueue, attendance: true }),
          });
          return toast.success("Attendance Confirmed");
        } else {
          return;
        }
      }
    };
    return () => scanning();
  }, [currentUser, scanResult]);

  return (
    <Container maxWidth="md">
      <Typography variant="h5" mb="16px" fontWeight="bold">
        Scan QR Code
      </Typography>
      <QrReader
        onResult={handleScan}
        containerStyle={{ marginTop: -64 }}
        delay={1000}
        style={{ width: "100%" }}
      />
    </Container>
  );
};

export default ScannerPage;
