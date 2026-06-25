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
import NodataFound from "../../../assets/img/nodatafound.png";
import { Link } from "react-router-dom";
import { API } from "../../../lib/endpoint";
import { GET } from "../../../lib/request";
export default function BasicTable() {
  const [phase, setPhase] = useState(null);

  const getAllSiteVmr = async () => {
    try {
      const res = await GET(API.SITE.GET_ALL_SITE_VMR);

      setPhase(res?.msg || []);
    } catch (error) {
      console.error("getAllSiteVmr error:", error);
      setPhase([]);
    }
  };

  useEffect(() => {
    getAllSiteVmr();
  }, []);
  useEffect(() => {
    let interval = setInterval(() => {
      getAllSiteVmr();
    }, 20000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
            <Typography className="heading-black  ">
              Phase Monitoring
            </Typography>
            ,
          </Breadcrumbs>{" "}
          <Typography className="heading-black fs-24  width100 mt-16">
            Phase Monitoring
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
                    R
                  </TableCell>
                  <TableCell
                    align="center"
                    className="white-typo fs-16 table-height border-left"
                  >
                    Y
                  </TableCell>
                  <TableCell
                    align="center"
                    className="white-typo fs-16 table-height border-left"
                  >
                    B
                  </TableCell>
                  <TableCell
                    align="center"
                    className="white-typo fs-16 table-height border-left"
                  >
                    RY
                  </TableCell>
                  <TableCell
                    align="center"
                    className="white-typo fs-16 table-height border-left"
                  >
                    YB
                  </TableCell>
                  <TableCell
                    align="center"
                    className="white-typo fs-16 table-height border-left"
                  >
                    RB
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {phase?.map((row, index) => {
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
                        {row?.vmrValue?.map((data, i) => {
                          const value = Object.values(row.vmrSensorsThreshold);
                          let vmrSThreshold = value;

                          return (
                            <>
                              <TableCell
                                align="center"
                                className={
                                  vmrSThreshold[i] < data.value
                                    ? "heading-black  table-height border-right table-cellbg "
                                    : "heading-black  table-height border-right "
                                }
                              >
                                {data.value}
                              </TableCell>
                            </>
                          );
                        })}
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {phase?.length === 0 && (
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
