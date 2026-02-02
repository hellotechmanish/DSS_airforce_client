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
import RejectImg from "../../../../../../assets/img/rejected.png";
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
export default function MaxWidthDialog({ openData, data, moveTo }) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("xs");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(openData);
  }, [openData]);

  const navigate = useNavigate();

  return (
    <React.Fragment>
      <BootstrapDialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
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
            overridesResolver: (styles) => {
              return styles.backdrop;
            },
          })({ zIndex: -1, backdropFilter: "blur(2px)" })}
        >
          <img src={RejectImg} className="successImg" />
          <Grid item className=" wrong-dialogitem">
            <svg
              class="checkmark-wrong "
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                class="checkmark__circle_wrong"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                class="checkmark__check"
                fill="none"
                d="M16 16 36 36 M36 16 16 36"
              />
            </svg>

            <Typography
              className="redcolortypo fs25px pt100px"
              style={{ maxWidth: "250px" }}
            >
              {data}
            </Typography>
          </Grid>
        </Grid>

        <Button
          className=" wrong-btn"
          onClick={() => {
            setOpen(false);
          }}
        >
          Back
        </Button>
      </BootstrapDialog>
    </React.Fragment>
  );
}
