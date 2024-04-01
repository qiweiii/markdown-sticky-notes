import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import DeleteIcon from "@mui/icons-material/Delete";

import { SyntheticEvent, useEffect, useState } from "react";

const StyledRoot = styled("div")`
  height: 100%;
  .delete-button {
    &.MuiButton-root {
      background-color: #f97171;
    }
    position: absolute;
    right: 20px;
    top: 80px;
  }
  .list-root {
    width: 100%;
    margin-top: 60px;
    align-items: center;
  }
  .item {
    width: 100%;
  }
  .text {
    color: blue;
    overflow: auto;
    width: 100%;
    white-space: nowrap;
  }
  .close {
    padding: 2rem;
  }
`;

type Data = {
  checked: boolean[];
  urls: string[];
};

const Notes = () => {
  const [data, setData] = useState<Data>({
    checked: [],
    urls: [],
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  useEffect(() => {
    getNewDataFromStorage();
  }, []);

  const getNewDataFromStorage = () => {
    browser.storage.local.get(null).then((content) => {
      // get entire storage
      // get urls
      let urls = [];
      for (const item in content) {
        // loop object keys
        if (
          item !== "id" &&
          item !== "defaultOpacity" &&
          item !== "defaultTheme" &&
          item !== "defaultEditorFontFamily" &&
          item !== "defaultEditorFontSize" &&
          item !== "defaultColor"
        ) {
          urls.push(item);
        }
      }
      // fill in checked array
      let array = new Array(urls.length).fill(false);
      setData({ ...data, checked: array, urls: urls });
    });
  };

  const handleToggle =
    (value: number) =>
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      let newChecked = [...data.checked];
      newChecked[value] = data.checked[value] === false;
      setData({ ...data, checked: newChecked });
    };

  const handleDelete = async () => {
    // delete selected items
    let items = [];
    for (let i = 0; i < data.checked.length; i++) {
      if (data.checked[i]) {
        items.push(data.urls[i]);
      }
    }
    if (items.length) {
      await browser.storage.local.remove(items);
      getNewDataFromStorage(); // refresh data
    }
    handleClose();
    handleOpenMessage("Deleted");
  };

  const handleClickOpen = () => {
    // dialog
    setDialogOpen(true);
  };

  const handleClose = () => {
    // dialog
    setDialogOpen(false);
  };

  const handleCloseMessage: (
    event: Event | SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void = (event) => {
    // snackbar
    setSnackbarMsg("");
  };

  const handleOpenMessage = (message: string) => {
    // snackbar
    setSnackbarMsg(message);
  };

  return (
    <StyledRoot>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        className="delete-button"
        disabled={data.checked.every((value) => value === false)}
      >
        <DeleteIcon fontSize="small" sx={{ mr: 0.5 }} /> Delete
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete selected items?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            All notes in all selected websites will be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarMsg !== ""}
        autoHideDuration={3000}
        onClose={handleCloseMessage}
        ContentProps={{
          "aria-describedby": "message-id",
        }}
        message={<span id="message-id">{snackbarMsg}</span>}
      />
      <List className="list-root">
        {data.urls.sort().map((value, i) => {
          const labelId = `checkbox-list-label-${i}`;
          return (
            <ListItem
              className="item"
              key={i}
              role={undefined}
              button
              component="a"
              href={value}
              target="_blank"
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  tabIndex={-1}
                  onChange={handleToggle(i)}
                  checked={data.checked[i]}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText className="text" id={labelId} primary={value} />
            </ListItem>
          );
        })}
      </List>
      {data.urls.length === 0 && (
        <DialogContentText className="close" id="alert-dialog-description">
          No notes found.
        </DialogContentText>
      )}
    </StyledRoot>
  );
};

export default Notes;
