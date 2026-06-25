import React, { useState } from "react";
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import toast from "react-hot-toast";

// Image
import Logout from "../../assets/img/logout.png";

// ================= Dialog Style =================
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(),
  },
}));

// ================= Dialog Title =================
const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle className="dialog-title" sx={{ m: 0, p: 1.2 }} {...other}>
      {children}
      <Typography className="white-typo">Logout</Typography>

      {onClose && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="dialogcrossicon-white"
        >
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

// ================= Main Component =================
export default function MaxWidthDialog({ logout }) {
  const [open, setOpen] = useState(false);
  const [fullWidth] = useState(true);
  const [maxWidth] = useState("sm");
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!loading) setOpen(false);
  };

  return (
    <>
      {/* Trigger */}
      <Grid container onClick={handleClickOpen}>
        <ListItemIcon className="sidebar-icon">
          <img src={Logout} alt="Logout" className="sidebar-image" />
        </ListItemIcon>
        <ListItemText disableTypography className="sidebar-text">
          Logout
        </ListItemText>
      </Grid>

      {/* Dialog */}
      <BootstrapDialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: "SmallDialog",
        }}
      >
        <BootstrapDialogTitle
          onClose={handleClose}
          id="customized-dialog-title"
        />

        <DialogContent className="mt-16">
          <Typography className="greycolor505050500">
            Are you sure you want to logout ?
          </Typography>
        </DialogContent>

        <DialogActions className="hgt-40">
          <Button
            sx={{ marginRight: "10px" }}
            className="grey-br-button width-100 hover"
            onClick={handleClose}
            disabled={loading}
          >
            No
          </Button>

          <Button
            sx={{ padding: "3px 0px" }}
            className="red-br-button width-100 hover-shodow-red"
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                await logout();

                toast.success("Logged out successfully ", {
                  duration: 3000,
                  style: {
                    background: "#111827",
                    color: "#fff",
                    borderRadius: "8px",
                  },
                });

                setOpen(false);
              } catch (error) {
                console.error(error);

                toast.error("Logout failed ", {
                  style: {
                    background: "#7f1d1d",
                    color: "#fff",
                  },
                });
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Logging out..." : "Yes"}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
