import React, { useState, useEffect } from "react";
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
  Tooltip,
  Container,
  Input,
  Grid,
  DialogActions,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
//React Icons
import { CiEdit } from "react-icons/ci";
import { FETCH_URL } from "../../../../../fetchIp";

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
      <Typography className="white-typo"> Edit User </Typography> {children}
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
export default function CustomizedDialogs({ getnumberOfUser, row, UserID }) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("lg");
  const [fullName, setFullName] = useState(null);
  const [uid, setUid] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [fullNameErr, setFullNameErr] = useState(false);
  const [uidErr, setUidErr] = useState(false);
  // ==================== States ======================== //

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const EditUser = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    try {
      const response = await fetch(`${FETCH_URL}/api/user/editUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userRole: 2,
          fullName: fullName,
          uid: uid,
          userId: UserID,
        }),
      });
      const res = await response.json();
      if (response.ok) {
        getnumberOfUser();
        setOpen(false);
      } else {
        // console.log("Else block ====>");
        setOpen(false);
      }
    } catch (error) {
      // console.log("Catch block ====>", error);
    }
  };
  useEffect(() => {
    if (row) {
      setFullName(row.fullName);
      setUid(row.uid ?? "");
    }
  }, [row]);

  return (
    <>
      <div>
        <Tooltip title="Edit" className="tooltipheight">
          <IconButton className="mt-5px icons-blue" onClick={handleClickOpen}>
            <CiEdit />
          </IconButton>
        </Tooltip>
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
          ></BootstrapDialogTitle>{" "}
          <form onSubmit={handleSubmit(EditUser)}>
            <DialogContent className="mt-32">
              <Container maxWidth="xl">
                <Grid container justifyContent="space-between">
                  <Grid item md={5.8}>
                    <Typography className="heading-black mt-16">
                      Full Name
                    </Typography>
                    <Input
                      className=" input-style-1c mt-12 width100"
                      disableUnderline
                      value={fullName}
                      {...register("Full-Name-ErrorInput", {
                        required: "Full Name is required.",
                        onChange: (e) => {
                          setFullName(e.target.value);
                        },
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="Full-Name-ErrorInput"
                      render={({ message }) => (
                        <Typography className="red-typo">{message}</Typography>
                      )}
                    />
                  </Grid>
                  <Grid item md={5.8}>
                    <Typography className="heading-black mt-16">UID</Typography>
                    <Input
                      className="input-style-1c mt-12 width100"
                      disableUnderline
                      value={uid}
                      {...register("UID-ErrorInput", {
                        required: "UID  is required.",
                        onChange: (e) => {
                          setUid(e.target.value);
                        },
                      })}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="UID-ErrorInput"
                      render={({ message }) => (
                        <Typography className="red-typo">{message}</Typography>
                      )}
                    />
                  </Grid>
                </Grid>
              </Container>
            </DialogContent>
            <DialogActions
              style={{ padding: "0px", margin: "0px", height: "80px" }}
            >
              <React.Fragment>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  className="mt-32 mb-10 mr-10"
                >
                  <Button
                    color="inherit"
                    onClick={handleClose}
                    className="grey-br-button  mr-10 hover width-100"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    className="skyblue-bg-button mr-10 width-100 hover"
                  >
                    Submit
                  </Button>
                </Grid>
              </React.Fragment>{" "}
            </DialogActions>
          </form>
        </BootstrapDialog>
      </div>
    </>
  );
}
