import { Box, TextField, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { forwardRef } from "react";

const AuthInput = forwardRef(({ errors, ...rest }, ref) => {
  return (
    <Box width="100%">
      <TextField ref={ref} fullWidth {...rest} sx={{ color: "white" }} />
      {errors ? (
        <Typography
          fontSize="14px"
          fontWeight="bold"
          pl="10px"
          mt="2px"
          color={red["300"]}
        >
          {errors.message}
        </Typography>
      ) : null}
    </Box>
  );
});

export default AuthInput;
