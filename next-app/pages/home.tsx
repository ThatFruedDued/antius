import {
  AppBar,
  Autocomplete,
  Box,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

const Home: NextPage = () => {
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Antius | Home</title>
      </Head>
      <Box flexGrow={1}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Antius
            </Typography>
            <Autocomplete
              sx={{ width: "25%" }}
              freeSolo
              disableClearable
              options={searchResults}
              onChange={(e, value) => {
                router.push("/profile/" + value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Find user"
                  variant="filled"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                  onChange={async (e) => {
                    setSearchResults([]);
                    const value = e.target.value;
                    await new Promise((r) => setTimeout(r, 100));
                    if (value === e.target.value) {
                      const res = await fetch("/api/findUsers", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          query: value,
                        }),
                      });
                      setSearchResults(await res.json());
                    }
                  }}
                />
              )}
            />
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100vw"
        flexGrow={1}
      >
        <Box>
          <Typography>Hello</Typography>
        </Box>
      </Box>
    </>
  );
};

export default Home;
