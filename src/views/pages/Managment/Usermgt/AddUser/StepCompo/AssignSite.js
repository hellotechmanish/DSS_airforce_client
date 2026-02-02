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
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
//React Icons
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

export default function CustomizedDialogs(props) {
  const {
    states: { sitesDataErr, originalData, sites },
    handleChangeSite,
  } = props;
  // States

  //=================================================//

  return (
    <div>
      <DialogContent sx={{ m: 0 }}>
        {sites?.length > 0 ? (
          <div className="admin-content">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {/* <Typography className="heading-black">Select Site </Typography> */}
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
            {sitesDataErr && (
              <Typography
                className="red-typo mb-10 mt-10 ml-20"
                variant={"subtitle2"}
              >
                {"Please Select the Site"}
              </Typography>
            )}
            <Typography className=" ml-20 mb-10 heading-black">
              Select Site
            </Typography>
            <Grid container className="mt-24">
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label "
                name="radio-buttons-group"
                className="width100"
              >
                {sites.map((data, i) => {
                  return (
                    <Grid
                      item
                      sx={{ border: "1px solid #dddddd", marginLeft: "20px" }}
                      className="access-radio-grid-no-mt"
                    >
                      <Grid container justifyContent="space-between">
                        <FormLabel>
                          <ListItemButton>
                            <Typography className=" heading-black">
                              {data.siteName}
                              <Typography className="subheading-grey600">
                                {data.uid}
                              </Typography>
                            </Typography>
                          </ListItemButton>
                        </FormLabel>
                        <FormControlLabel
                          className="radiostyle access-radio-formcontrolabel"
                          style={{ justifyContent: "space-between" }}
                          control={
                            <Radio
                              checked={originalData === data._id ? true : false}
                            />
                          }
                          value={data}
                          onChange={(e) => handleChangeSite(e, data, i)}
                          key={data}
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
              className="width100 heading-black fs25px"
            >
              No Site found! <br />
              Please Add Site using Below button <br />
              <Link to="/sites-mgt" className="linkcolor">
                <Button className=" skyblue-bg-button fs-16 mt-16  hover width-100">
                  Add Site
                </Button>
              </Link>
            </Typography>
          </Grid>
        )}
      </DialogContent>
    </div>
  );
}
