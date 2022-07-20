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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionActions from "@mui/material/AccordionActions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function Sales() {
  const [rows, setRows] = React.useState([]);
  const [filter, setFilter] = React.useState("");
  const [newOpen, setNewOpen] = React.useState(false);
  const [delOpen, setDelOpen] = React.useState(false);
  const [extract, setExtract] = React.useState(false);
  const [toDel, setToDel] = React.useState(0);

  const [value, setValue] = React.useState(new Date("2022-01-01T21:11:54"));

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const [newValues, setNewValues] = React.useState({
    número: 0,
    data: "",
    cliente: "",
    vendedor: 0,
    itens: [{ produto: 0, quantidade: 0 }],
    itemCount: 1,
  });

  React.useEffect(() => {
    axios.get("/vendas").then((response) => {
      setRows(response.data.vendas);
    });
  }, []);

  const handleNewChange = (prop) => (event) => {
    setNewValues({ ...newValues, [prop]: event.target.value });
  };

  const handleIndexChange = (id, prop) => (event) => {
    let items = newValues["itens"];
    items[id][prop] = event.target.value;
    setNewValues({ ...newValues, ["itens"]: items });
  };

  const handleClickNewOpen = () => {
    setNewOpen(true);
  };

  const handleExtract = (val) => {
    const newVal = val.target.value;

    if (newVal) {
      axios.get("/vendas", { data: { periodo: value.toJSON() } }).then((response) => {
        setRows(response.data.vendas);
      });
    } else {
      axios.get("/vendas").then((response) => {
        setRows(response.data.vendas);
      });
    }
    setExtract(val.target.value);
  };

  const handleNewClose = () => {
    setNewOpen(false);
  };

  const handleNewLine = () => {
    let moreLines = newValues["itens"];
    moreLines.push({ produto: 0, quantidade: 0 });
    setNewValues({
      ...newValues,
      ["itemCount"]: newValues["itemCount"] + 1,
      ["itens"]: moreLines,
    });
  };

  const handleRemLine = (event, index) => {
    event.stopPropagation();
    let moreLines = newValues["itens"].filter((el, i) => i != index);
    setNewValues({
      ...newValues,
      ["itemCount"]: newValues["itemCount"] - 1,
      ["itens"]: moreLines,
    });
  };

  const handleNewCancel = () => {
    setNewValues({
      número: 0,
      data: "",
      cliente: "",
      vendedor: 0,
      itens: [{ produto: 0, quantidade: 0 }],
      itemCount: 1,
    });
    setNewOpen(false);
  };

  const handleDelete = (evt) => {
    console.log(toDel);
    evt.stopPropagation();
    axios
      .delete("/vendas/", { data: { número: rows[toDel].número } })
      .then(() => {
        setRows(rows.filter((row, idx) => idx != toDel));
      });
    setDelOpen(false);
  };

  const handleNewSubmit = () => {
    axios
      .post("/vendas", {
        número: newValues.número,
        data: newValues.data,
        cliente: newValues.cliente,
        vendedor: newValues.vendedor,
        itens: newValues.itens,
      })
      .then((response) => {
        let nrows = rows;
        nrows.push({
          número: newValues.número,
          data: newValues.data,
          cliente: newValues.cliente,
          vendedor: newValues.vendedor,
          itens: newValues.itens,
        });
        setRows(nrows);
        setNewValues({
          número: 0,
          data: "",
          cliente: "",
          vendedor: 0,
          itens: [{ produto: 0, quantidade: 0 }],
          itemCount: 1,
        });
      });
    setNewOpen(false);
  };

  return (
    <Stack>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Stack direction="row" alignItems="center">
          <Typography
            padding="20px"
            fontWeight="500"
            variant="h5"
            component="div"
          >
            Vendas
          </Typography>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            variant="contained"
            color="success"
            sx={{ minHeight: "50%" }}
            onClick={handleClickNewOpen}
          >
            NOVA VENDA
          </Button>
          <Stack direction="row" paddingLeft="20px" sx={{ width: "13%" }}>
            <InputBase
              placeholder="Pesquisar Venda por Número"
              sx={{ width: "100%" }}
              onChange={(event) => {
                setFilter(event.target.value);
              }}
            />
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Stack>
          {/* <Stack direction="row" sx={{ width: "100" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Extrair a partir de: "
                inputFormat="dd/MM/yyyy"
                value={value}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <Checkbox value={extract} onChange={handleExtract} />
          </Stack> */}
        </Stack>
      </Paper>
      {rows
        .slice()
        .filter((val) => {
          return filter.length == 0 || String(val.número).includes(filter);
        })
        .map((row, index) => {
          return (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                id="panel1a-header"
              >
                <Typography variant="h6">Venda {row.número}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography paddingLeft="20px" component="div">
                  Data da Venda: {row.data}
                </Typography>
                <Typography paddingLeft="20px" component="div">
                  Cliente: {row.cliente}
                </Typography>
                <Typography
                  paddingLeft="20px"
                  paddingBottom="20px"
                  component="div"
                >
                  Vendedor: {row.vendedor}
                </Typography>
                <Divider paddingLeft="20px" />
                <Typography
                  paddingLeft="20px"
                  paddingTop="20px"
                  variant="h6"
                  component="div"
                >
                  Itens
                </Typography>
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Código Item</TableCell>
                        <TableCell align="center">Nome Item</TableCell>
                        <TableCell align="center">Quantidade</TableCell>
                        <TableCell align="center">Preço Unit.</TableCell>
                        <TableCell align="center">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.itens.map((row) => (
                        <TableRow
                          key={row.name}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.produto}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {row.nome}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {row.quantidade}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {row.preço}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {row.quantidade * row.preço}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          );
        })}
      <Dialog open={newOpen} onClose={handleNewClose}>
        <DialogTitle>Nova Venda</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, preencha os seguintes dados para adicionar a venda ao
            banco de dados.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={newValues.número}
            onChange={handleNewChange("número")}
            label="Número"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Data"
            value={newValues.data}
            onChange={handleNewChange("data")}
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="CPF do Cliente"
            value={newValues.cliente}
            onChange={handleNewChange("cliente")}
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Número de Matrícula do Vendedor"
            type="numeric"
            value={newValues.vendedor}
            onChange={handleNewChange("vendedor")}
            fullWidth
            variant="standard"
          />
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Código Item</TableCell>
                  <TableCell align="center">Quantidade</TableCell>
                  <TableCell>
                    <IconButton onClick={handleNewLine}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...Array(newValues.itemCount).keys()].map((key, index) => (
                  <TableRow>
                    <TableCell align="center">
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        type="numeric"
                        value={newValues.itens[index].produto}
                        onChange={handleIndexChange(index, "produto")}
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        type="numeric"
                        value={newValues.itens[index].quantidade}
                        onChange={handleIndexChange(index, "quantidade")}
                        fullWidth
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleRemLine(e, index)}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
      <Dialog
        open={delOpen}
        onClose={() => {
          setDelOpen(false);
        }}
      >
        <DialogTitle>Excluir Venda</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a venda{" "}
            {rows.length > 0 ? rows[toDel].número : "a"}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button>CANCELAR</Button>
          <Button
            color="error"
            onClick={(e) => {
              handleDelete(e);
            }}
          >
            EXCLUIR
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
