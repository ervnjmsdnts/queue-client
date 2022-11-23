import { TextField } from "@mui/material";
import { forwardRef } from "react";

const AuthInput = forwardRef(({ ...rest }, ref) => {
  return <TextField ref={ref} fullWidth {...rest} sx={{ color: "white" }} />;
});

export default AuthInput;
