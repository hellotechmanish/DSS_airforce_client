import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  Grid,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import { FETCH_URL } from "../../../fetchIp";
import NodataFound from "../../../assets/img/nodatafound.png";
import { Link } from "react-router-dom";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function BasicTable() {
  const [resistance, setResistance] = useState(null);
  const getAllSiteResistance = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(`${FETCH_URL}/api/site/getAllSiteResistance`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let res = await response.json();
    if (response.ok) {
      setResistance(res.msg);
    } else {
    }
  };

  useEffect(() => {
    getAllSiteResistance();
  }, []);
  useEffect(() => {
    let interval = setInterval(() => {
      getAllSiteResistance();
    }, 20000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Container maxWidth="xl">
        <Grid container direction="row" className="widthLR-90  ">
          {/* <Breadcrumbs separator="›" aria-label="breadcrumb" className="mt-24">
            <Link
              to="/dashboard"
              className="linkcolor"
              underline="hover"
              key="1"
            >
              <Typography className="sky-typo fs-16">Dashboard</Typography>
            </Link>
            <Typography className="heading-black  ">
              Resistance Monitoring
            </Typography>
            ,
          </Breadcrumbs> */}

          <Typography className="white-typo textShadow   m-t-40px   fs-24  width100 ">
            Resistance Monitoring
          </Typography>

          <TableContainer className="width100 table-container-nobc mt-24">
            <Table aria-label="simple table">
              <TableHead className="table-row">
                <TableRow>
                  <TableCell
                    align="center"
                    className="white-typo fs-16 table-height border-right"
                  >
                    Site UID
                  </TableCell>
                  <TableCell
                    align="center"
                    className="white-typo fs-16 table-height border-right"
                  >
                    Site Name
                  </TableCell>
                  <TableCell
                    align="center"
                    className="white-typo fs-16 table-height border-right"
                  >
                    Device UID
                  </TableCell>
                  <TableCell
                    align="center"
                    className="white-typo fs-16 table-height border-right"
                  >
                    Device Name
                  </TableCell>
                  <TableCell
                    align="center"
                    className="white-typo fs-16 table-height border-left"
                  >
                    Resistance UID
                  </TableCell>
                  <TableCell
                    align="center"
                    className="white-typo fs-16 table-height border-left"
                  >
                    Resistance Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resistance?.map((row, index) => {
                  return (
                    <>
                      <TableRow
                        key={row.index}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                            padding: "8px",
                          },
                        }}
                      >
                        {row?.siteId?.map((data, i) => {
                          return (
                            <>
                              <TableCell
                                align="center"
                                className="heading-black table-height border-right "
                                component="th"
                                scope="row"
                              >
                                #{data.uid}
                              </TableCell>
                              <TableCell
                                align="center"
                                className="heading-black  table-height border-right"
                              >
                                {data.siteName}
                              </TableCell>
                            </>
                          );
                        })}

                        <TableCell
                          align="center"
                          className="heading-black  table-height border-right"
                        >
                          #{row.nodeUid}
                        </TableCell>
                        <TableCell
                          align="center"
                          className="heading-black  table-height border-right"
                        >
                          {row.deviceName}
                        </TableCell>
                        <TableCell
                          align="center"
                          className="heading-black  table-height border-right"
                        >
                          {row.resistanceNumber}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={
                            row.resSensorsThreshold < row?.resistanceValue == 1
                              ? " table-cellbg table-height border-left"
                              : "heading-black table-height border-left "
                          }
                        >
                          {row.resistanceValue}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {resistance?.length === 0 && (
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ height: "60vh" }}
            >
              <Grid item>
                <img alt="NodataFound" src={NodataFound} />
                <Typography align="center" className="mt-16 blue-typo">
                  No Device found!
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
