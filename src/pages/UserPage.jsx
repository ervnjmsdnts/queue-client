import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Queue from "../containers/User/Queue";

const UserPage = () => {
  return (
    <Box>
      <Box
        mb="16px"
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Age</InputLabel>
          <Select label="Age">
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box display="grid" gap="24px" gridTemplateColumns="repeat(4, 1fr)">
        <Queue category="REGISTRAR" window="Window 1" />
        <Queue category="REGISTRAR" window="Window 1" />
        <Queue category="REGISTRAR" window="Window 1" />
        <Queue category="REGISTRAR" window="Window 1" />
        <Queue category="REGISTRAR" window="Window 1" />
      </Box>
    </Box>
  );
};

export default UserPage;
