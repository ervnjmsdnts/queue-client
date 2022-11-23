import { Box, Button, Typography } from "@mui/material";

const Queue = ({ category, window, queueNumber = 0, est = "115min" }) => {
  return (
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
          {category}
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
      <Button variant="contained" fullWidth size="large" disableElevation>
        Go in Queue
      </Button>
    </Box>
  );
};

export default Queue;
