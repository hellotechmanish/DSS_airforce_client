import React, { useState, useEffect } from "react";
import { Typography, Breadcrumbs, Grid, Container } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import NodataFound from "../../../../../assets/img/nodatafound.png";
import EditTechnician from "../ActionUser/UserEdit";
import DeleteDialog from "../ActionUser/DeleteUser";
import PasswordReset from "../ActionUser/UserPasswordReset";
export default function Sites({ user, getnumberOfUser }) {
  useEffect(() => {
    getnumberOfUser();
  }, []);
  return (
    <>
      <Grid container direction="row" className=" mt-24 width100 mb-40">
        {user?.length > 0 ? (
          <TableContainer className="width100 table-container">
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    className="subheading-grey600 fs-16"
                  >
                    {" "}
                    UID
                  </TableCell>
                  <TableCell
                    align="center"
                    className="subheading-grey600 fs-16"
                  >
                    {" "}
                    User Name
                  </TableCell>
                  <TableCell
                    align="center"
                    className="subheading-grey600 fs-16"
                  >
                    {" "}
                    Sites
                  </TableCell>
                  <TableCell
                    align="center"
                    className="subheading-grey600 fs-16"
                  >
                    {" "}
                    Password
                  </TableCell>
                  <TableCell
                    align="center"
                    className="subheading-grey600 fs-16"
                  >
                    {" "}
                    Added on
                  </TableCell>
                  <TableCell
                    align="center"
                    className="subheading-grey600 fs-16"
                  >
                    {" "}
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user?.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell
                      align="center"
                      className="p-0"
                      component="th"
                      scope="row"
                    >
                      <Link
                        to="/user-profile"
                        state={row}
                        className="linkcolor sky-typo fw-600 hover"
                      >
                        {row?.uid}{" "}
                      </Link>
                    </TableCell>
                    <TableCell align="center">
                      <Link
                        to="/user-profile"
                        state={row}
                        className="linkcolor sky-typo fw-600 hover"
                      >
                        {row?.fullName}{" "}
                      </Link>
                    </TableCell>
                    <TableCell align="center" className="heading-black">
                      {row?.siteCount}
                    </TableCell>

                    <TableCell align="center" className="heading-black">
                      *********
                    </TableCell>
                    <TableCell align="center" className="heading-black">
                      {dayjs(row?.createdAt).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell align="center">
                      <Grid
                        container
                        justifyContent="space-evenly"
                        direction="row"
                      >
                        <EditTechnician
                          UserID={row._id}
                          row={row}
                          getnumberOfUser={getnumberOfUser}
                        />{" "}
                        <PasswordReset
                          UserID={row._id}
                          getnumberOfUser={getnumberOfUser}
                        />
                        <DeleteDialog
                          UserID={row._id}
                          getnumberOfUser={getnumberOfUser}
                        />
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Grid container>
            <Grid item className="mt-32 width100">
              <Typography align="center">
                <img src={NodataFound} />{" "}
              </Typography>
            </Grid>
            <Typography className="heading-black width100 mt-42" align="center">
              No User Found!
            </Typography>
            <Typography className="heading-black width100 mt-24" align="center">
              Click Add Button
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
}
