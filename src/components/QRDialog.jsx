import { Box, Button, Dialog } from "@mui/material";

const QRDialog = ({ onClose, open, QRSrc }) => {
  const onDownload = (href) => {
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = href;
    link.click();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <Box
        display="flex"
        p="32px"
        flexDirection="column"
        alignItems="center"
        width="100%"
      >
        <Box
          component="img"
          src={QRSrc}
          alt="dialogQR"
          width="200px"
          height="200px"
        />
        <Button onClick={() => onDownload(QRSrc)} fullWidth variant="contained">
          Download
        </Button>
      </Box>
    </Dialog>
  );
};

export default QRDialog;
