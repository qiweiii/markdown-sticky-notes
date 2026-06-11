import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import NoteIcon from "@mui/icons-material/Note";
import { useState } from "react";

import Notes from "./pages/Notes";
import Preference from "./pages/Preference";
import About from "./pages/About";
import unwrapMuiIcon from "../unwrapMuiIcon";

const pages = [
  { id: "notes", label: "Notes" },
  { id: "preference", label: "Preferences" },
  { id: "about", label: "About" },
];
const MenuIconComponent = unwrapMuiIcon(MenuIcon);
const NoteIconComponent = unwrapMuiIcon(NoteIcon);

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState("notes");

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "#fff",
          color: "#111827",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 64, gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: { xs: "none", md: "grid" },
                  placeItems: "center",
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
              >
                <NoteIconComponent sx={{ color: "#111827" }} />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    display: { xs: "none", md: "flex" },
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    color: "#111827",
                  }}
                >
                  Markdown Sticky Note
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{
                    display: { xs: "none", md: "flex" },
                    color: "#6b7280",
                  }}
                >
                  Floating markdown notes for any page.
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontWeight: 700,
                letterSpacing: ".08rem",
                color: "#111827",
              }}
            >
              MD Sticky Note
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-end",
                gap: 0.5,
              }}
            >
              {pages.map((pageItem) => (
                <Button
                  key={pageItem.id}
                  onClick={() => {
                    setPage(pageItem.id);
                    handleCloseNavMenu();
                  }}
                  variant={pageItem.id === page ? "contained" : "text"}
                  sx={{
                    my: 2,
                    px: 2,
                    py: 1,
                    borderRadius: 999,
                    color: pageItem.id === page ? "#111827" : "#4b5563",
                    display: "block",
                    backgroundColor:
                      pageItem.id === page
                        ? "#f3f4f6"
                        : "transparent",
                    boxShadow: "none",
                    '&:hover': {
                      backgroundColor:
                        pageItem.id === page
                          ? "#e5e7eb"
                          : "#f9fafb",
                      boxShadow: "none",
                    },
                  }}
                >
                  {pageItem.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIconComponent />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((pageItem) => (
                  <MenuItem
                    key={pageItem.id}
                    onClick={() => {
                      setPage(pageItem.id);
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography textAlign="center">{pageItem.label}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {page === "notes" && <Notes />}
      {page === "preference" && <Preference />}
      {page === "about" && <About />}
    </>
  );
}

export default ResponsiveAppBar;
