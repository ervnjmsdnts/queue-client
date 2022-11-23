import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import QueueConfirmationDialog from "./QueueConfirmationDialog";

const Queue = ({ organization, window, queueNumber = 0, est = "115min" }) => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <QueueConfirmationDialog
        onClose={() => setOpenDialog(false)}
        open={openDialog}
        organization={organization}
        window={window}
      />
      <Box
        p="16px"
        boxShadow={2}
        display="flex"
        flexDirection="column"
        gap="8px"
        borderRadius="16px"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight="bold">
            {organization}
          </Typography>
          <Typography variant="h6" color="gray">
            {window}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight="bold" variant="h6">
              People in Queue
            </Typography>
            <Typography variant="h6">{queueNumber}</Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight="bold" variant="h6">
              Estimated Time
            </Typography>
            <Typography variant="h6">{est}</Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          fullWidth
          size="large"
          disableElevation
          onClick={() => setOpenDialog(true)}
        >
          Go in Queue
        </Button>
      </Box>
    </>
  );
};

export default Queue;
