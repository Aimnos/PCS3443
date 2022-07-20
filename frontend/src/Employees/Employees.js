import * as React from "react";

import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "matrícula",
    numeric: true,
    disablePadding: true,
    label: "Número de Matrícula do Vendedor",
    align: "left",
  },
  {
    id: "nome",
    numeric: false,
    disablePadding: true,
    label: "Nome do Vendedor",
    align: "center",
  },
  {
    id: "salárioBruto",
    numeric: true,
    disablePadding: true,
    label: "Salário Bruto (R$)",
    align: "center",
  },
  {
    id: "dataAdmissão",
    numeric: false,
    disablePadding: true,
    label: "Data de Admissão",
    align: "center",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected, callback } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} {numSelected == 1 ? "selecionado" : "selecionados"}.
        </Typography>
      ) : (
        <Stack
          direction="row"
          sx={{ width: "100%" }}
          justifyContent="flex-start"
        >
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h5"
            id="tableTitle"
            component="Box"
          >
            Vendedores
          </Typography>
          <Stack direction="row" sx={{ width: "25%" }}>
            <InputBase
              placeholder="Pesquisar matrícula"
              sx={{ width: "50%" }}
              onChange={(event) => callback(event.target.value)}
            />
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Stack>
        </Stack>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Employees() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("nome");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [rows, setRows] = React.useState([]);
  const [newOpen, setNewOpen] = React.useState(false);
  const [delOpen, setDelOpen] = React.useState(false);
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("");

  const [newValues, setNewValues] = React.useState({
    matrícula: 0,
    nome: "",
    senha: "",
    salárioBruto: 0.0,
    dataAdmissão: "",
  });

  const [updateValues, setUpdateValues] = React.useState({
    matrícula: 0,
    nome: "",
    senha: "",
    salárioBruto: 0.0,
    dataAdmissão: "",
  });

  const handleNewChange = (prop) => (event) => {
    setNewValues({ ...newValues, [prop]: event.target.value });
  };

  const handleUpdateChange = (prop) => (event) => {
    setUpdateValues({ ...updateValues, [prop]: event.target.value });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

    const handleClickUpdateOpen = () => {
        let selectedRow = rows.filter((val) => {
            return val.matrícula == selected[0];
        })[0];
        console.log(rows);
    setUpdateValues({
      matrícula: selectedRow.matrícula,
      nome: selectedRow.nome,
      senha: selectedRow.senha,
      salárioBruto: selectedRow.salárioBruto,
      dataAdmissão: selectedRow.dataAdmissão,
    });
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
  };

  const handleClickNewOpen = () => {
    setNewOpen(true);
  };

  const handleNewClose = () => {
    setNewOpen(false);
  };

  const handleDelClose = () => {
    setDelOpen(false);
  };

  const handleClickDelOpen = () => {
    setDelOpen(true);
  };

  const handleNewCancel = () => {
    setNewValues({
      matrícula: 0,
      nome: "",
      senha: "",
      salárioBruto: 0.0,
      dataAdmissão: "",
    });
    setNewOpen(false);
  };

    const handleNewSubmit = () => {
    axios
      .post("/vendedores/", {
        matrícula: newValues.matrícula,
        nome: newValues.nome,
        senha: newValues.senha,
        salárioBruto: newValues.salárioBruto,
        dataAdmissão: newValues.dataAdmissão,
      })
      .then((response) => {
        let nrows = rows;
        nrows.push({
          matrícula: newValues.matrícula,
          nome: newValues.nome,
          senha: newValues.senha,
          salárioBruto: newValues.salárioBruto,
          dataAdmissão: newValues.dataAdmissão,
        });
        setRows(nrows);
        setNewValues({
          matrícula: newValues.matrícula,
          nome: newValues.nome,
          senha: newValues.senha,
          salárioBruto: newValues.salárioBruto,
          dataAdmissão: newValues.dataAdmissão,
        });
      });
    setNewOpen(false);
  };

  const handleDelete = () => {
    axios
      .delete("/vendedores/", { data: { matrícula: selected[0] } })
      .then(() => {
        setRows(rows.filter((row) => row.matrícula != selected[0]));
        setSelected([]);
      });
    setDelOpen(false);
  };

    const handleUpdate = () => {
        console.log(updateValues);
    axios
      .put("/vendedores/", {
        matrícula: updateValues.matrícula,
        nome: updateValues.nome,
        senha: updateValues.senha,
        salárioBruto: updateValues.salárioBruto,
        dataAdmissão: updateValues.dataAdmissão,
      })
      .then(() => {
        let newRows = rows.filter((row) => row.matrícula != selected[0]);
        newRows.push({
          matrícula: updateValues.matrícula,
          nome: updateValues.nome,
          senha: updateValues.senha,
          salárioBruto: updateValues.salárioBruto,
          dataAdmissão: updateValues.dataAdmissão,
        });
        setSelected([]);
        setRows(newRows);
      });
    setUpdateOpen(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.matrícula);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const fromTo = ({ from, to, count }) =>
    `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`;

  React.useEffect(() => {
    axios.get("/vendedores").then((response) => {
      setRows(response.data.vendedores);
    });
  }, []);

  if (!rows) return null;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          callback={(val) => {
            setFilter(val);
          }}
        />
        {rows.length > 0 ? (
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {rows
                  .slice()
                  .filter((val) => {
                    return (
                      filter.length == 0 ||
                      String(val.matrícula).includes(filter)
                    );
                  })
                  .sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.matrícula);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.matrícula)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.nome}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.matrícula}
                        </TableCell>
                        <TableCell align="center">{row.nome}</TableCell>
                        <TableCell align="center">{row.salárioBruto}</TableCell>
                        <TableCell align="center">{row.dataAdmissão}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box display="flex" paddingTop="50px" paddingBottom="50px">
            <Box m="auto">
              <Typography
                sx={{ flex: "1 1 100%" }}
                variant="h5"
                id="tableTitle"
                component="div"
              >
                Ooops... não há nada aqui ainda! :(
              </Typography>
            </Box>
          </Box>
        )}
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          padding="20px"
        >
          {selected.length == 1 ? (
            <Stack direction="row">
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={handleClickDelOpen}
              >
                REMOVER
              </Button>
              <Button startIcon={<EditIcon />} onClick={handleClickUpdateOpen}>
                ATUALIZAR
              </Button>
            </Stack>
          ) : (
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="contained"
              color="success"
              onClick={handleClickNewOpen}
            >
              NOVO VENDEDOR
            </Button>
          )}
          <TablePagination
            rowsPerPageOptions={[15, 30, 60]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={fromTo}
          />
          <Dialog open={delOpen} onClose={handleDelClose}>
            <DialogTitle>Excluir Vendedor</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Tem certeza que deseja excluir o vendedor{" "}
                {selected.length > 0 ? selected[0] : "a"}?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDelClose}>CANCELAR</Button>
              <Button onClick={handleDelete} color="error">
                EXCLUIR
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={newOpen} onClose={handleNewClose}>
            <DialogTitle>Novo Vendedor</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Por favor, preencha os seguintes dados para adicionar o vendedor
                ao banco de dados.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                value={newValues.matrícula}
                onChange={handleNewChange("matrícula")}
                label="Número de Matrícula"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Nome"
                value={newValues.nome}
                onChange={handleNewChange("nome")}
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Salário Bruto (R$)"
                value={newValues.salárioBruto}
                onChange={handleNewChange("salárioBruto")}
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Data de Admissão"
                type="numeric"
                value={newValues.dataAdmissão}
                onChange={handleNewChange("dataAdmissão")}
                fullWidth
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleNewCancel} color="error">
                CANCELAR
              </Button>
              <Button onClick={handleNewSubmit} color="success">
                CONFIRMAR
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={updateOpen} onClose={handleUpdateClose}>
            <DialogTitle>Atualizar Vendedor</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Por favor, atualize os dados conforme necessidade.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                value={updateValues.matrícula}
                onChange={handleUpdateChange("matrícula")}
                label="Número de Matrícula"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Nome"
                value={updateValues.nome}
                onChange={handleUpdateChange("nome")}
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Salário Bruto (R$)"
                value={updateValues.salárioBruto}
                onChange={handleUpdateChange("salárioBruto")}
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Data de Admissão (R$)"
                type="numeric"
                value={updateValues.dataAdmissão}
                onChange={handleUpdateChange("dataAdmissão")}
                fullWidth
                variant="standard"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateClose} color="error">
                CANCELAR
              </Button>
              <Button onClick={handleUpdate} color="success">
                CONFIRMAR
              </Button>
            </DialogActions>
          </Dialog>
        </Stack>
      </Paper>
    </Box>
  );
}
