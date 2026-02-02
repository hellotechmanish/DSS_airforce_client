import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
  Grid,
  Typography,
  DialogContent,
  FormControlLabel,
  InputBase,
  ListItemButton,
  FormLabel,
} from "@mui/material";
//React Icons

import SearchIcon from "@mui/icons-material/Search";
import { FETCH_URL } from "../../../../../../fetchIp";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "0px",
  backgroundColor: "rgba(247, 248, 253, 1)",
  "&:hover": {
    backgroundColor: "rgba(247, 248, 253, 1)",
  },
  marginLeft: 0,
  width: "100%",
  fontWeight: "400",
  // [theme.breakpoints.up("lg")]: {
  //   marginLeft: theme.spacing(1),
  //   width: "auto",
  // },
  width: "36%",
}));
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      "&:focus": {
        width: "93%",
      },
    },
  },
}));

export default function Device(props) {
  const {
    states: {
      originalDeviceData,
      sitesDeviceDataErr,
      sitesData,
      siteUid,
      device,
    },
    handleChangeDevice,
  } = props;
  // States
  const [deviceData, setDeviceData] = React.useState([]);
  // // console.log("Check Orignal Data", sitesData);
  //=================================================//

  const [sites, setSites] = useState(null);

  const [value, setValue] = React.useState(0);
  const TabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <DialogContent sx={{ m: 0 }}>
        {device ? (
          <div className="admin-content">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid container>
                {sitesDeviceDataErr && (
                  <Typography
                    className="red-typo mb-10 ml-20"
                    variant={"subtitle2"}
                  >
                    {"Please Select the Device"}
                  </Typography>
                )}
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  className="width100"
                >
                  <Typography
                    sx={{ marginLeft: "20px" }}
                    className="heading-black width100"
                  >
                    Selected Site
                  </Typography>
                  <Grid
                    item
                    sx={{
                      border: "1px solid #dddddd",
                      marginLeft: "20px",
                    }}
                    className="access-radio-grid"
                  >
                    <Grid container justifyContent="space-between">
                      <FormLabel>
                        <ListItemButton>
                          <Typography className=" heading-black">
                            {sitesData}
                            <Typography className="subheading-grey600">
                              {siteUid}
                            </Typography>
                          </Typography>
                        </ListItemButton>
                      </FormLabel>
                      <FormControlLabel
                        value={sitesData}
                        className="radiostyle access-radio-formcontrolabel"
                        control={<Radio checked={true} />}
                        style={{ justifyContent: "space-between" }}
                        key={sitesData}
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </Grid>
              {/* <Search className="search-sites mt-24">
                <SearchIconWrapper>
                  <SearchIcon className="searchicon" />
                </SearchIconWrapper>
                <StyledInputBase
                  className=""
                  placeholder="Search Site ID / Name"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search> */}
            </Grid>

            <Grid container className="mt-24">
              <Typography className=" ml-20  heading-black">
                Select Device
              </Typography>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                className="width100"
              >
                {device?.map((data, i) => {
                  return (
                    <Grid
                      item
                      sx={{ border: "1px solid #dddddd", marginLeft: "20px" }}
                      className="access-radio-grid"
                    >
                      <Grid container justifyContent="space-between">
                        <FormLabel>
                          <ListItemButton>
                            <Typography className=" heading-black">
                              {data?.deviceName}
                              <Typography className="subheading-grey600">
                                {data?.nodeUid}
                              </Typography>
                            </Typography>
                          </ListItemButton>
                        </FormLabel>
                        <FormControlLabel
                          value={data._id}
                          className="radiostyle access-radio-formcontrolabel"
                          control={
                            <Radio
                              checked={
                                originalDeviceData === data._id ? true : false
                              }
                            />
                          }
                          style={{ justifyContent: "space-between" }}
                          onChange={(e) => handleChangeDevice(e, data, i)}
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
              No Device found!
            </Typography>
          </Grid>
        )}
      </DialogContent>
    </div>
  );
}
