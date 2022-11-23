import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
} from "@mui/material";
import Queue from "../containers/User/Queue";

const UserPage = () => {
  const matches = useMediaQuery("(min-width: 600px)");
  return (
    <Box>
      <Box
        mb="16px"
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <FormControl sx={{ minWidth: matches ? "200px" : "100%" }} size="small">
          <InputLabel id="label">Organization</InputLabel>
          <Select label="Organization" labelId="label" defaultValue={10}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box
        display="grid"
        gap="24px"
        gridTemplateColumns={!matches ? "repeat(1, 1fr)" : "repeat(4, 1fr)"}
      >
        <Queue organization="REGISTRAR" window="Window 1" />
        <Queue organization="REGISTRAR" window="Window 2" />
        <Queue organization="REGISTRAR" window="Window 3" />
        <Queue organization="REGISTRAR" window="Window 4" />
        <Queue organization="REGISTRAR" window="Window 5" />
      </Box>
    </Box>
  );
};

export default UserPage;
