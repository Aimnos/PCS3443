import * as React from "react";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function Login({ setToken }) {
  const [username, setusr] = React.useState("");
  const [pass, setpass] = React.useState("");
  const [hideAlert, setHide] = React.useState(true);

  const authenticate = () => {
    axios
      .get("/login", { params: { login: username, senha: pass } })
      .then((res) => {
        if (res.status == 200) {
          setToken(true);
        } else {
          setHide(false);
        }
      });
  };

  return (
    <Box
      flexGrow="1"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Card sx={{ width: "20vw", height: "40vh" }}>
        <CardContent>
          <Box display="flex">
            <Box m="auto">
              <Typography
                variant="h4"
                component="div"
                sx={{ flexGrow: 1, fontWeight: 600, "padding-top": "20px" }}
                gutterBottom
              >
                Por favor, faça login.
              </Typography>
            </Box>
          </Box>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            paddingTop="20px"
            spacing={2}
          >
            <TextField
              id="usuario"
              label="Nome de Usuário"
              value={username}
              onChange={(ev) => {
                setusr(ev.target.value);
              }}
              sx={{ width: "80%" }}
            />
            <TextField
              id="senha"
              type="password"
              label="Senha"
              value={pass}
              onChange={(ev) => {
                setpass(ev.target.value);
              }}
              sx={{ width: "80%" }}
            />
            <Stack
              paddingTop="10px"
              direction="row"
              justifyContent="end"
              sx={{ width: "80%" }}
            >
              <Button
                variant="contained"
                color="success"
                onClick={authenticate}
              >
                <Typography color="#fff" fontWeight="500">
                  ENTRAR
                </Typography>
              </Button>
            </Stack>
            {!hideAlert && <Alert severity="error">
              <AlertTitle>Autenticação Incorreta</AlertTitle>
              Por favor — <strong>verifique seus dados!</strong>
            </Alert>}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
