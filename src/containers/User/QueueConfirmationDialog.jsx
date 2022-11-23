import { Box, Button, Dialog, Typography } from "@mui/material";

const QueueConfirmationDialog = ({ onClose, open, organization, window }) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <Box p="32px">
        <Typography
          width="300px"
          fontWeight="bold"
          variant="h5"
          textAlign="center"
          mb="16px"
        >
          Are you sure to queue for {organization} {window}?
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          gap="16px"
          justifyContent="center"
        >
          <Button color="error" variant="contained" onClick={onClose}>
            No
          </Button>
          <Button color="success" variant="contained">
            Yes
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default QueueConfirmationDialog;
