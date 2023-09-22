import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import { NavLink } from "react-router-dom";

export default function Programari(props) {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);

  let extracted = [...props.apps];

  function createData(
    idProgramare,
    idMedic,
    appData,
    numeDoctor,
    speciality,
    numePacient
  ) {
    return {
      idProgramare,
      idMedic,
      appData,
      numeDoctor,
      speciality,
      numePacient,
    };
  }

  const rows = extracted.map((item) =>
    createData(
      item.id,
      item.forDoctor,
      item.appData,
      item.numeDoctor,
      item.speciality,
      `${item.numePacient} ${item.prenumePacient}`
    )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function convertDate(inputFormat) {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);

    const data = [
      pad(d.getDate()),
      pad(d.getMonth() + 1),
      d.getFullYear(),
    ].join(".");

    const time = inputFormat.split("T")[1].slice(0, 5);

    return `${data} | ${time}`;
  }

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "rgba(0, 120, 170, 0.8)" }}>
                <TableRow>
                  <TableCell sx={{ fontSize: 16 }} align="center">
                    Data programării{" "}
                  </TableCell>
                  <TableCell sx={{ fontSize: 16 }} align="center">
                    Doctor
                  </TableCell>
                  <TableCell sx={{ fontSize: 16 }} align="center">
                    Specialitate
                  </TableCell>
                  <TableCell sx={{ fontSize: 16 }} align="center">
                    Pacient
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody sx={{ backgroundColor: "rgba(240,255,240,0.5)" }}>
                {rows.map((row) => (
                  <TableRow key={row.idProgramare}>
                    {row.name}

                    <TableCell align="center">
                      <NavLink
                        to={`/user/programare/${row.idProgramare}`}
                        className="NOTLink"
                      >
                        {convertDate(row.appData)}
                      </NavLink>
                    </TableCell>

                    {new Date(row.appData.slice(0, -1)) > new Date() ? (
                      <TableCell align="center">
                        <NavLink
                          to={`/user/review/${row.idMedic}`}
                          className="NOTbutton"
                        >
                          Dr. {row.numeDoctor}
                        </NavLink>
                      </TableCell>
                    ) : (
                      <TableCell align="center">Dr. {row.numeDoctor}</TableCell>
                    )}
                    <TableCell align="center">{row.speciality}</TableCell>
                    <TableCell align="center">{row.numePacient}</TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow style={{ height: 30 }}>
                    <TableCell align="center"> - </TableCell>
                    <TableCell align="center"> - </TableCell>
                    <TableCell align="center"> - </TableCell>
                    <TableCell align="center"> - </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{ backgroundColor: "rgba(70, 170, 70, 0.7)" }}
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
}
