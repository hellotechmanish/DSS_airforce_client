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
} from "@mui/material";
import NodataFound from "../../../assets/img/nodatafound.png";
import { GET } from "../../../lib/request";
import { API } from "../../../lib/endpoint";

export default function BasicTable() {
  const [resistance, setResistance] = useState([]);

  const getAllSiteResistance = async () => {
    try {
      const res = await GET(API.SITE.ALL_RESISTANCE);
      console.log("Resistance API =>", res);

      // safe fallback
      setResistance(res?.msg || []);
    } catch (error) {
      console.error("Error fetching site resistance:", error);
      setResistance([]);
    }
  };

  useEffect(() => {
    getAllSiteResistance();

    const interval = setInterval(() => {
      getAllSiteResistance();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container direction="row" className="widthLR-90">
        <Typography className="white-typo textShadow m-t-40px fs-24 width100">
          Resistance Monitoring
        </Typography>

        <TableContainer className="width100 table-container-nobc mt-24">
          <Table>
            <TableHead className="table-row">
              <TableRow>
                <TableCell align="center" className="white-typo fs-16">
                  Site UID
                </TableCell>
                <TableCell align="center" className="white-typo fs-16">
                  Site Name
                </TableCell>
                <TableCell align="center" className="white-typo fs-16">
                  Device UID
                </TableCell>
                <TableCell align="center" className="white-typo fs-16">
                  Device Name
                </TableCell>
                <TableCell align="center" className="white-typo fs-16">
                  Resistance UID
                </TableCell>
                <TableCell align="center" className="white-typo fs-16">
                  Resistance Value
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {resistance.length > 0 &&
                resistance.map((row, index) => (
                  <TableRow key={`${row._id}-${index}`}>
                    {/* Site Data */}
                    {row?.siteId?.length > 0 ? (
                      row.siteId.map((data, i) => (
                        <React.Fragment key={i}>
                          <TableCell align="center">#{data?.uid}</TableCell>
                          <TableCell align="center">{data?.siteName}</TableCell>
                        </React.Fragment>
                      ))
                    ) : (
                      <>
                        <TableCell align="center">-</TableCell>
                        <TableCell align="center">-</TableCell>
                      </>
                    )}

                    {/* Device Data */}
                    <TableCell align="center">#{row?.nodeUid || "-"}</TableCell>

                    <TableCell align="center">
                      {row?.deviceName || "-"}
                    </TableCell>

                    <TableCell align="center">
                      {row?.resistanceNumber || "-"}
                    </TableCell>

                    {/* Fixed Condition */}
                    <TableCell
                      align="center"
                      className={
                        row?.resSensorsThreshold < row?.resistanceValue
                          ? "table-cellbg"
                          : ""
                      }
                    >
                      {row?.resistanceValue || "-"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* No Data */}
        {resistance.length === 0 && (
          <Grid
            container
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
  );
}
