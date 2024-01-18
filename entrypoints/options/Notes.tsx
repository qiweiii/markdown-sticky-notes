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
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { MouseEventHandler, SyntheticEvent, useEffect, useState } from "react";

const StyledRoot = styled("div")`
  .root {
    width: 100%;
    margin-top: 2%;
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
  open: boolean;
  showMessage: boolean;
  message: string;
};

const Notes = () => {
  const [data, setData] = useState<Data>({
    checked: [],
    urls: [],
    open: false,
    showMessage: false,
    message: "",
  });

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
          item !== "defaultEditorFontSize"
        ) {
          urls.push(item);
        }
      }
      // fill in checked array
      let array = new Array(urls.length).fill(false);
      setData({ ...data, checked: array, urls: urls });
    });
  };

  const handleToggle = (value: number) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    let newChecked = [...data.checked];
    newChecked[value] = data.checked[value] === false;
    setData({ ...data, checked: newChecked });
  };

  const handleDelete = () => {
    // delete selected items
    let items = [];
    for (let i = 0; i < data.checked.length; i++) {
      if (data.checked[i]) {
        items.push(data.urls[i]);
      }
    }
    // console.log(items);
    if (items.length === 0) {
      handleOpenMessage("No items selected");
    } else {
      // chrome storage
      browser.storage.local.remove(items).then(() => {
        handleOpenMessage("Success!");
        // update state
        getNewDataFromStorage();
      });
    }

    handleClose(); // close dialog
  };

  const handleClickOpen = () => {
    // dialog
    setData({ ...data, open: true });
  };

  const handleClose = () => {
    // dialog
    setData({ ...data, open: false });
  };

  const handleCloseMessage: (event: Event | SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => void = (event) => {
    // snackbar
    setData({ ...data, showMessage: false });
  };

  const handleOpenMessage = (message: string) => {
    // snackbar
    setData({ ...data, message: message });
    setData({ ...data, showMessage: true });
  };

  return (
    <StyledRoot>
      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={data.open}
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
        open={data.showMessage}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        ContentProps={{
          "aria-describedby": "message-id",
        }}
        message={<span id="message-id">{data.message}</span>}
        // action={[
        //   <IconButton
        //     key="close"
        //     color="inherit"
        //     className="close"
        //     onClick={handleCloseMessage}
        //   >
        //     <CloseIcon />
        //   </IconButton>,
        // ]}
      />
      <List className="root">
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
    </StyledRoot>
  );
};

export default Notes;
