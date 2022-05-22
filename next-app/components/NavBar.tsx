import {
  HomeRounded as HomeRoundedIcon,
  LogoutRounded as LogoutRoundedIcon,
  MenuRounded as MenuRoundedIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Autocomplete,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const NavBar = () => {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const router = useRouter();

  return (
    <Box flexGrow={1}>
      <AppBar position="static">
        <Toolbar>
          <Drawer
            anchor="left"
            open={navDrawerOpen}
            onClose={() => setNavDrawerOpen(false)}
          >
            <Box width={250}>
              <List>
                {(
                  [
                    [
                      "Home",
                      () => router.push("/home"),
                      <HomeRoundedIcon key="Home" />,
                    ],
                    [
                      "Log Out",
                      () => {
                        localStorage.removeItem("token");
                        router.replace("/");
                      },
                      <LogoutRoundedIcon key="Log Out" />,
                    ],
                  ] as const
                ).map((item) => (
                  <ListItem disablePadding key={item[0]}>
                    <ListItemButton onClick={item[1]}>
                      <ListItemIcon>{item[2]}</ListItemIcon>
                      <ListItemText primary={item[0]} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setNavDrawerOpen(true)}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <Link href="/home">Antius</Link>
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
  );
};

export default NavBar;
