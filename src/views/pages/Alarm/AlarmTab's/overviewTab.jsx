import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import dayjs from "dayjs";
import { AiOutlineSearch } from "react-icons/ai";

import DeleteDialog from "../DeleteAlarm";
import NodataFound from "../../../../assets/img/nodatafound.png";
import axiosInstance from "../../../../api/axiosInstance";
// pagination

export default function Alarm() {
  const [alarm, setAlarm] = useState(null);
  const tableContainerRef = useRef();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState(null);
  const handleSearchClose = () => {
    setSearchTerm("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
  };

  const params = {
    search: searchTerm ? searchTerm : null,
    startDate: dayjs("2023-01-01").startOf("day").format("YYYY-MM-DD"),
    endDate: dayjs("2030-01-01").endOf("day").format("YYYY-MM-DD"),
    page: page + 1,
    limit: rowsPerPage,
    sortBy: "createdAt",
    sortType: 1,
  };

  useEffect(() => {
    if (searchTerm?.length > 0) {
      getAllAlarm();
    } else if (page || rowsPerPage) {
      getAllAlarm();
    }
  }, [page, rowsPerPage, searchTerm]);

  const getAllAlarm = async () => {
    try {
      const response = await axiosInstance.get(`/api/alarm/getAlarmData`, {
        params,
      });
      if (response.data) {
        setAlarm(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (page || rowsPerPage) {
        getAllAlarm();
      }
    }, 10000);
    return () => clearInterval(intervalId);
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (tableContainerRef && tableContainerRef.current) {
      const tableContainer = tableContainerRef.current;
      const scrollPosition = tableContainer.scrollTop;
      tableContainer.scrollTop = scrollPosition;
    }
  }, [page, rowsPerPage, tableContainerRef]);

  return (
    <>
      <Grid container direction="row" className="mt-8">
        <Grid
          mt={3}
          container
          direction="row"
          alignItems="center"
          justifyContent={"space-between"}
        >
          <Typography variant="subtitle" pt={2}>
            Showing {alarm?.data?.length} of {alarm?.lengthData} Alarm
          </Typography>
          <Grid item>
            <TextField
              size="small"
              className="search-input"
              placeholder="Search  UID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 4 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AiOutlineSearch fontSize="large" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm?.length > 0 && (
                  <InputAdornment position="end">
                    <IoClose
                      fontSize="large"
                      className="cursor"
                      onClick={handleSearchClose}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <Grid container className="mt-24">
          {alarm?.data.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="simple table" ref={tableContainerRef}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" className="subheading-grey600">
                      Site ID
                    </TableCell>
                    <TableCell align="center" className="subheading-grey600">
                      Site Name
                    </TableCell>

                    <TableCell align="center" className="subheading-grey600">
                      Device UID{" "}
                    </TableCell>
                    <TableCell align="center" className="subheading-grey600">
                      Device Name{" "}
                    </TableCell>
                    <TableCell align="center" className="subheading-grey600">
                      Sensor Name{" "}
                    </TableCell>
                    <TableCell align="center" className="subheading-grey600">
                      Threshold Value{" "}
                    </TableCell>
                    <TableCell align="center" className="subheading-grey600">
                      Alarm Value{" "}
                    </TableCell>
                    <TableCell align="center" className="subheading-grey600">
                      Time
                    </TableCell>
                    <TableCell align="center" className="subheading-grey600">
                      Date{" "}
                    </TableCell>
                    <TableCell align="center" className="subheading-grey600">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alarm?.data?.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell
                        align="center"
                        className="p-0"
                        component="th"
                        scope="row"
                      >
                        {row?.deviceId?.siteId?.uid}
                      </TableCell>
                      <TableCell
                        padding={0}
                        align="center"
                        className="heading-black "
                      >
                        {row?.deviceId?.siteId?.siteName}
                      </TableCell>
                      <TableCell align="center" className="heading-black ">
                        {row?.deviceId?.nodeUid}
                      </TableCell>
                      <TableCell align="center" className="heading-black ">
                        {row?.deviceId?.deviceName}
                      </TableCell>{" "}
                      <TableCell align="center" className="heading-black ">
                        {row.SensorName}
                      </TableCell>{" "}
                      <TableCell align="center">{row.thresholdValue}</TableCell>{" "}
                      <TableCell align="center" className="red-typo">
                        {row.alarmValue}
                      </TableCell>{" "}
                      <TableCell align="center" className="heading-black ">
                        {dayjs(row?.createdAt).format("h:mm A")}
                      </TableCell>
                      <TableCell align="center" className="heading-black ">
                        {dayjs(row?.createdAt).format("DD-MM-YYYY")}
                      </TableCell>{" "}
                      <TableCell align="center">
                        <Grid
                          container
                          justifyContent="space-evenly"
                          direction="row"
                        >
                          <DeleteDialog
                            alarmID={row._id}
                            getnumberOfAlarm={getAllAlarm}
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
              <Typography
                className="heading-black width100 mt-42"
                align="center"
              >
                No Alarm found!
              </Typography>
            </Grid>
          )}
        </Grid>
        <Grid container justifyContent={"flex-end"}>
          <TablePagination
            rowsPerPageOptions={[
              10,
              25,
              50,
              100,
              200,
              { label: "All", value: 10000 },
            ]}
            component="div"
            count={alarm?.lengthData}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />{" "}
        </Grid>
      </Grid>
    </>
  );
}
