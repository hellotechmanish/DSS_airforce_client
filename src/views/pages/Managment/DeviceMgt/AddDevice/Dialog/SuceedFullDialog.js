import * as React from "react";
import {
  Grid,
  Backdrop,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
import SuccesImg from "../../../assets/img/SuccessImg.png";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 1.2, background: "#5FCA5D" }} {...other}>
      {children}
      <Typography className="whitecolortypo">Approve order </Typography>{" "}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "red",
          }}
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
export default function MaxWidthDialog({
  handleSubmitdata,
  open,
  setOpenDevice,
  setOpen,
}) {
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("xs");
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  // const handleClose = () => {
  //   setOpen(false);
  // };
  const navigate = useNavigate();
  const Continue = () => {
    setOpen(false);
    navigate("/dashboard");
  };
  return (
    <React.Fragment>
      {/* <Button
        onClick={handleClickOpen}
        className=" width-25 "
        style={{ padding: "4px 0px", color: "#ffffff" }}
      >
        Submit
      </Button> */}
      <BootstrapDialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        PaperProps={{
          className: "SuccessDialog",
        }}
        BackdropComponent={styled(Backdrop, {
          name: "MuiModal",
          slot: "Backdrop",
          overridesResolver: (props, styles) => {
            return styles.backdrop;
          },
        })({ zIndex: -1, backdropFilter: "blur(2px)" })}
      >
        <Grid
          container
          style={{
            position: "relative",
            justifyContent: "center",
            backgroundColor: "transparent",
          }}
          BackdropComponent={styled(Backdrop, {
            name: "MuiModal",
            slot: "Backdrop",
            overridesResolver: (props, styles) => {
              return styles.backdrop;
            },
          })({ zIndex: -1, backdropFilter: "blur(2px)" })}
        >
          <img src={SuccesImg} className="successImg" />
          <Grid item className=" succesdialogitem">
            <svg
              class="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                class="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                class="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
            <Typography className="green-typo fs-24 pt100px">
              Device Added
            </Typography>
          </Grid>
        </Grid>

        <Button
          className="whitecolortypo continue-btn"
          onClick={() => Continue()}
        >
          Continue
        </Button>
      </BootstrapDialog>
    </React.Fragment>
  );
}
