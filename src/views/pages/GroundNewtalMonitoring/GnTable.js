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
import { Link } from "react-router-dom";
import { FETCH_URL } from "../../../fetchIp";
import NodataFound from "../../../assets/img/nodatafound.png";

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
  const [groundNewtal, setGroundNewtal] = useState(null);
  const getAllSiteGn = async () => {
    let token = JSON.parse(localStorage.getItem("userData")).token;
    const response = await fetch(`${FETCH_URL}/api/site/getAllSiteGn`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let res = await response.json();
    if (response.ok) {
      console.log(" get number Of Site resp ===> ", res.msg);
      setGroundNewtal(res.msg);
    } else {
      // // console.log("Error in get number Of Site ==> ", res);
    }
  };
  useEffect(() => {
    getAllSiteGn();
  }, []);

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     getAllSiteGn();
  //   }, 20000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <>
      <Container maxWidth="xl">
        <Grid container direction="row" className="widthLR-90 ">
          <Breadcrumbs separator="›" aria-label="breadcrumb" className="mt-24">
            <Link
              to="/dashboard"
              className="linkcolor"
              underline="hover"
              key="1"
            >
              <Typography className="sky-typo fs-16">Dashboard</Typography>
            </Link>
            <Typography className="heading-black  ">Gn Monitoring</Typography>,
          </Breadcrumbs>
          <Typography className="heading-black fs-24  width100 mt-16">
            GN Monitoring
          </Typography>
          <TableContainer className="width100 table-container-nobc mt-24">
            <Table aria-label="simple table">
              {groundNewtal === 0 ? (
                <TableHead className="table-row">
                  <TableRow>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-right"
                    >
                      Site UID
                    </TableCell>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-right"
                    >
                      Site Name
                    </TableCell>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-right"
                    >
                      Device UID
                    </TableCell>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-right"
                    >
                      Device Name
                    </TableCell>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-right"
                    >
                      Sensor
                    </TableCell>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-left"
                    >
                      Sensor Value
                    </TableCell>
                  </TableRow>
                </TableHead>
              ) : (
                <TableHead className="table-row">
                  <TableRow>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-right"
                    >
                      Site UID
                    </TableCell>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-right"
                    >
                      Site Name
                    </TableCell>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-right"
                    >
                      Device UID
                    </TableCell>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-right"
                    >
                      Device Name
                    </TableCell>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-right"
                    >
                      GN UID
                    </TableCell>
                    <TableCell
                      align="center"
                      className="white-typo  fs-16 table-height border-left"
                    >
                      GN Value
                    </TableCell>
                  </TableRow>
                </TableHead>
              )}

              <TableBody>
                {groundNewtal?.map((row, index) => {
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
                          {row.gnNumber}
                        </TableCell>
                        <TableCell
                          align="center"
                          className={
                            row.resSensorsThreshold < Object.values(row)[1]
                              ? "   table-cellbg  table-height border-left"
                              : "heading-black table-height border-left "
                          }
                        >
                          {row.gnValue}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {groundNewtal?.length === 0 && (
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
