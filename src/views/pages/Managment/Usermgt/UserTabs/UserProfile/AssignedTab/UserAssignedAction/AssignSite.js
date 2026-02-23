import React, { useState, useEffect } from "react";
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Snackbar,
  RadioGroup,
  FormLabel,
  ListItemButton,
  FormControlLabel,
  Radio,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import SiteAdd from "../../../../../SitesMgt/AddSite/SitesAddDialog";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { API } from "../../../../../../../../lib/endpoint";
import { GET,POST } from "../../../../../../../../lib/request";
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
    <DialogTitle className="dialog-title-add" sx={{ m: 0, p: 1.2 }} {...other}>
      {children}
      <Typography className="white-typo">Assign Site </Typography>{" "}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          className="dialogcrossicon-white"
        >
          <CloseIcon className="fs-20" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function MaxWidthDialog({ getnumberOfAssignSite, UserId }) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth] = React.useState(true);
  const [maxWidth] = React.useState("md");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // SnackBar
  const [snackopen, setSnackOpen] = useState(false);
  const [snackmsg, setSnackMsg] = useState("");
  const [snackErrMsg, setSnackErrMsg] = useState();
  const [snackerropen, setSnackerropen] = useState(false);

  const SnanbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
    setSnackMsg("");
  };

  const SnackbarErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackerropen(false);
    setSnackErrMsg("");
  };
  const [sites, setSites] = useState(null);
  const [siteid, setSitesid] = useState(null);
  const handleChangeSite = (e, data) => {
    setSitesid(data._id);
  };
  const getnumberOfSite = async () => {
    try {
      const res = await GET(API.SITE.COUNT);

      if (res) {
        setSites(res?.msg || []);
      }
    } catch (error) {
      console.error("getnumberOfSite error:", error);
      setSites([]);
    }
  };

  const AssignSiteToUser = async () => {
    try {
      const res = await POST(API.USERS.ASSIGN_SITE, {
        userId: UserId,
        siteId: siteid,
      });

      if (res) {
        setSnackOpen(true);
        setSnackMsg(res?.msg || "Site assigned successfully");

        setOpen(false);
        getnumberOfAssignSite();
      } else {
        setSnackerropen(true);
        setSnackErrMsg(res?.err || "Failed to assign site");
      }
    } catch (error) {
      console.error("AssignSiteToUser error:", error);

      setSnackerropen(true);
      setSnackErrMsg(error?.msg || "Failed to assign site");
    }
  };

  useEffect(() => {
    getnumberOfSite();
  }, []);
  return (
    <React.Fragment>
      <Snackbar open={snackopen} autoHideDuration={3000} onClose={SnanbarClose}>
        <Alert onClose={SnanbarClose} severity={"success"}>
          {snackmsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={snackerropen}
        autoHideDuration={8000}
        onClose={SnackbarErrorClose}
      >
        <Alert onClose={SnackbarErrorClose} severity={"error"}>
          {snackErrMsg}
        </Alert>
      </Snackbar>
      <Button
        className=" skyblue-bg-button fs-16 width-150  hover"
        onClick={handleClickOpen}
      >
        Assign Site
      </Button>
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
          id="customized-dialog-title"
          onClose={handleClose}
        ></BootstrapDialogTitle>{" "}
        <DialogContent sx={{ m: 0 }}>
          {sites ? (
            <div className="admin-content">
              <Grid container>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  className="width100 mt-32"
                >
                  {sites.map((data) => {
                    return (
                      <Grid
                        item
                        sx={{
                          border: "1px solid #dddddd",
                          marginLeft: "20px",
                        }}
                        className="access-radio-grid-no-mt"
                      >
                        <Grid container justifyContent="space-between">
                          <FormLabel>
                            <ListItemButton>
                              <Typography className=" greycolor505050400">
                                {data.siteName}
                                <Typography className="lightgreycolortypo">
                                  {data.uid}{" "}
                                </Typography>
                              </Typography>
                            </ListItemButton>
                          </FormLabel>
                          <FormControlLabel
                            value={data._id}
                            className="radiostyle access-radio-formcontrolabel"
                            control={<Radio />}
                            style={{ justifyContent: "space-between" }}
                            onChange={(e) => handleChangeSite(e, data)}
                            key={data._id}
                          />
                        </Grid>
                      </Grid>
                    );
                  })}
                </RadioGroup>
              </Grid>
            </div>
          ) : (
            <Grid container sx={{ height: "70vh" }}>
              <Typography
                align="center"
                alignItems="center"
                alignSelf="center"
                className="width100 blackcolortypo fs25px"
              >
                No Site Found! <br />
                Please Add Site. <br />
                <SiteAdd getnumberOfSite={getnumberOfSite} />
              </Typography>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ marginBottom: "10px" }}>
          <Button
            sx={{ marginRight: "10px" }}
            className="  grey-br-button width-100 hover "
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            sx={{ padding: "3px 0px" }}
            type="submit"
            className="skyblue-br-button  width-100 hover"
            onClick={() => {
              AssignSiteToUser();
              //   setOpen(false);
            }}
          >
            Submit
          </Button>
        </DialogActions>{" "}
      </BootstrapDialog>
    </React.Fragment>
  );
}
