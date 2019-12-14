/*global chrome*/
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    marginTop: "2%",
    alignItems: 'center',
  },
  item: {
    width: '100%',
    color: "blue",
  },
  close: {
    padding: theme.spacing(0.5),
  },
});

class Preference extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: [0],
      urls: [],
      open: false,
      showMessage: false,
      message: ""
    };
  }

  componentDidMount() {
    this.getNewDataFromStorage();
  }
  getNewDataFromStorage = () => {
    chrome.storage.local.get(null, function(content) { // get entire storage
      // get urls
      let urls = [];
      for (const item in content) { // loop object keys
        if (item !== "id" &&
            item !== "defaultTheme" &&
            item !== "defaultEditorFontFamily" &&
            item !== "defaultEditorFontSize") {
              urls.push(item);
            }
      }
      this.setState({urls: urls});
      // console.log(urls);
      // fill in checked array
      let array = new Array(this.state.urls.length).fill(false);
      this.setState({checked: array});
    }.bind(this));
  }
  handleToggle = (value) => () => {
    let newChecked = [...this.state.checked];
    newChecked[value] = this.state.checked[value] === false;
    this.setState({
      checked: newChecked
    });
  };
  handleDelete = () => {
    this.handleClose(); // close dialog
    // delete selected items
    let items = [];
    for (let i = 0; i < this.state.checked.length; i++) {
      if (this.state.checked[i]) {
        items.push(this.state.urls[i]);
      }
    }
    // console.log(items);
    if (items.length === 0) {
      this.handleOpenMessage("No items selected")
    } else {
      // chrome storage
      chrome.storage.local.remove(items, function() {
        this.getNewDataFromStorage();
        this.handleOpenMessage("Success!")
      }.bind(this));
    }
  }
  handleClickOpen = () => { // dialog
    this.setState({open: true});
  };
  handleClose = () => { // dialog
    this.setState({open: false});
  };
  handleCloseMessage = (event, reason) => { // snackbar
    if (reason === 'clickaway') {
      return;
    }
    this.setState({showMessage: false});
  }
  handleOpenMessage = (message) => { // snackbar
    this.setState({message: message});
    this.setState({showMessage: true});
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
      <Button variant="contained" color="secondary" onClick={this.handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={this.state.open}
        onClose={() => this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete selected items?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            All notes in all selected websites will be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.showMessage}
        autoHideDuration={6000}
        onClose={this.handleCloseMessage}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{this.state.message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            className={classes.close}
            onClick={this.handleCloseMessage}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
      <List className={classes.root}>
        {this.state.urls.map((value, i) => {
          const labelId = `checkbox-list-label-${i}`;
          return (
            <ListItem className={classes.item} key={i} role={undefined} button component="a" href={value} target="_blank">
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  tabIndex={-1}
                  onChange={this.handleToggle(i)}
                  checked={this.state.checked[i]}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
      </List>
      </div>
  )};
}

export default withStyles(styles)(Preference);