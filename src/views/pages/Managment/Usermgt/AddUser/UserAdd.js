import React, { useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
  DialogContent,
  IconButton,
  DialogTitle,
  Dialog,
  Button,
  Typography,
} from "@mui/material";
//React Icons
import AddUserStep from "./AddUserStepper";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(0),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle className="dialog-title-add" sx={{ m: 0, p: 1.2 }} {...other}>
      <Typography className="white-typo">Add User </Typography> {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="dialogcrossicon-white"
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
const options = ["Option 1", "Option 2"];
export default function CustomizedDialogs({ getnumberOfUser }) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("lg");

  // ==================== States ======================== //

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        <Button
          sx={{ width: "100px" }}
          className=" skyblue-bg-button fs-16  hover"
          onClick={handleClickOpen}
        >
          Add
        </Button>
        <BootstrapDialog
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          ></BootstrapDialogTitle>
          <DialogContent className="mt-32">
            <AddUserStep
              handleClose={handleClose}
              open={open}
              setOpen={setOpen}
              getnumberOfUser={getnumberOfUser}
            />
          </DialogContent>
        </BootstrapDialog>
      </div>
    </>
  );
}
