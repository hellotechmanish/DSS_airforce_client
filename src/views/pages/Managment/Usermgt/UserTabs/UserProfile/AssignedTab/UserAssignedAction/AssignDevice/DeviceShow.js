import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
  Grid,
  Typography,
  DialogContent,
  FormControlLabel,
  ListItemButton,
  FormLabel,
} from "@mui/material";
//React Icons

export default function Device(props) {
  const {
    states: { sitesDeviceDataErr, sitesData, state, device, selectUid },
    handleChangeDevice,
  } = props;
  // States
  // // console.log("Check Orignal Data", sitesData);
  //=================================================//

  // const [sites, setSites] = useState(null);

  return (
    <div>
      <DialogContent sx={{ m: 0 }}>
        <Grid container>
          {sitesDeviceDataErr && (
            <Typography className="red-typo mb-10 ml-20" variant={"subtitle2"}>
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
                      {state?.fullName}
                      <Typography className="subheading-grey600">
                        {selectUid}
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
        {device ? (
          <div className="admin-content">
            {/* <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Search className="search-sites mt-24">
                <SearchIconWrapper>
                  <SearchIcon className="searchicon" />
                </SearchIconWrapper>
                <StyledInputBase
                  className=""
                  placeholder="Search Site ID / Name"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Grid> */}
            <Grid container>
              <Typography className="heading-black width100 ml-20 mt-16">
                Select Device
              </Typography>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                className="width100"
              >
                {device?.map((data) => {
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
                          control={<Radio />}
                          style={{ justifyContent: "space-between" }}
                          onChange={(e) => handleChangeDevice(e, data)}
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
          <Grid container sx={{ height: "50vh" }}>
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
