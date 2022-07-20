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
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
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
    id: "CPF",
    numeric: false,
    disablePadding: true,
    label: "CPF",
    align: "left",
  },
  {
    id: "nome",
    numeric: false,
    disablePadding: false,
    label: "Nome do Cliente",
    align: "center",
  },
  {
    id: "endereco",
    numeric: false,
    disablePadding: false,
    label: "Endereço",
    align: "center",
  },
  {
    id: "telefone",
    numeric: false,
    disablePadding: false,
    label: "Telefone",
    align: "center",
  },
  {
    id: "pontos",
    numeric: true,
    disablePadding: false,
    label: "Pontos acumulados",
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
            Clientes
          </Typography>
          <Stack direction="row" sx={{ width: "25%" }}>
            <InputBase
              placeholder="Pesquisar CPF"
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

export default function Clients() {
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
    CPF: "",
    nome: "",
    endereco: "",
    telefone: "",
    pontos: 0,
  });

  const [updateValues, setUpdateValues] = React.useState({
    CPF: "",
    nome: "",
    endereco: "",
    telefone: "",
    pontos: 0,
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
      return val.CPF == selected[0];
    })[0];
    setUpdateValues({
      CPF: selectedRow.CPF,
      nome: selectedRow.nome,
      endereco: selectedRow.endereco,
      telefone: selectedRow.telefone,
      pontos: selectedRow.pontos,
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
      CPF: "",
      nome: "",
      endereco: "",
      telefone: "",
      pontos: 0,
    });
    setNewOpen(false);
  };

  const handleNewSubmit = () => {
    axios
      .post("/clientes", {
        CPF: newValues.CPF,
        nome: newValues.nome,
        endereco: newValues.endereco,
        telefone: newValues.telefone,
        pontos: newValues.pontos,
      })
      .then((response) => {
        let nrows = rows;
        nrows.push({
          CPF: newValues.CPF,
          nome: newValues.nome,
          endereco: newValues.endereco,
          telefone: newValues.telefone,
          pontos: newValues.pontos,
        });
        setRows(nrows);
        setNewValues({
          CPF: "",
          nome: "",
          endereco: "",
          telefone: "",
          pontos: 0,
        });
      });
    setNewOpen(false);
  };

  const handleDelete = () => {
    axios.delete("/clientes/", { data: { CPF: selected[0] } }).then(() => {
      setRows(rows.filter((row) => row.CPF != selected[0]));
      setSelected([]);
    });
    setDelOpen(false);
  };

  const handleUpdate = () => {
    axios
      .put("/clientes/", {
        CPF: updateValues.CPF,
        nome: updateValues.nome,
        endereco: updateValues.endereco,
        telefone: updateValues.telefone,
        pontos: updateValues.pontos,
      })
      .then(() => {
        let newRows = rows.filter((row) => row.CPF != selected[0]);
        newRows.push({
          CPF: updateValues.CPF,
          nome: updateValues.nome,
          endereco: updateValues.endereco,
          telefone: updateValues.telefone,
          pontos: updateValues.pontos,
        });
        setSelected([]);
        setRows(newRows);
      });
    setUpdateOpen(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.CPF);
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
    axios.get("/clientes").then((response) => {
      setRows(response.data.clientes);
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
                      String(val.CPF)
                        .split(".")
                        .join("")
                        .split("-")
                        .join("")
                        .includes(
                          filter.split(".").join("").split("-").join("")
                        )
                    );
                  })
                  .sort(getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.CPF);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.CPF)}
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
                          {row.CPF}
                        </TableCell>
                        <TableCell align="center">{row.nome}</TableCell>
                        <TableCell align="center">{row.endereco}</TableCell>
                        <TableCell align="center">{row.telefone}</TableCell>
                        <TableCell align="center">{row.pontos}</TableCell>
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
              NOVO CLIENTE
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
            <DialogTitle>Excluir Registro de Cliente</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Tem certeza que deseja excluir o registro do cliente{" "}
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
            <DialogTitle>Registrar Novo Cliente</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Por favor, preencha os dados do novo cliente a ser registrado.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                value={newValues.CPF}
                onChange={handleNewChange("CPF")}
                label="CPF"
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
                label="Endereço"
                value={newValues.endereco}
                onChange={handleNewChange("endereco")}
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Telefone"
                value={newValues.telefone}
                onChange={handleNewChange("telefone")}
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Pontos Acumulados"
                value={newValues.pontos}
                onChange={handleNewChange("pontos")}
                type="numerci"
                fullWidth
                variant="standard"
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
            <DialogTitle>Atualizar Registro de Cliente</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Por favor, atualize os dados conforme necessidade.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                value={updateValues.CPF}
                onChange={handleUpdateChange("CPF")}
                label="CPF"
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
                label="Endereço"
                value={updateValues.endereco}
                onChange={handleUpdateChange("endereco")}
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Telefone"
                value={updateValues.telefone}
                onChange={handleUpdateChange("telefone")}
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Pontos Acumulados"
                value={updateValues.pontos}
                onChange={handleUpdateChange("pontos")}
                type="numerci"
                fullWidth
                variant="standard"
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
