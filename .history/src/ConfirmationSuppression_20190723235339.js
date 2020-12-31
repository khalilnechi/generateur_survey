import React from 'react';
import logo from './logo.svg';
import './App.css';
import Creation_sondage from './files/creation_sondage'
//import { Button } from 'react-bootstrap';
import * as firebase from "firebase/app";

/******************************************************* */

import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade direction="up" ref={ref} {...props} />;
});

class App extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        i: 0,
        openDialog: false
      };
  
      this.handleClick = this.handleClick.bind(this);
      this.closeAgree = this.closeAgree.bind(this);
    }
    handleClick() {
      console.log("click");
  
      this.setState({ i: this.state.i + 1 });
      this.setState({ openDialog: true });
    }
  
    closeAgree() {
      
  
    }
    render() {
      return (
  
<Dialog
            open={this.state.openDialog}
            TransitionComponent={Transition}
            keepMounted
            //onClose={handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">Suppression du sondage {this.state.i}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Voulez-vous vraiment supprimer le sondage numero {this.state.i} ?
          </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button color="primary" onClick={() => {
                console.log("Annuler")
                this.setState({ openDialog: false })
              }}>
                Annuler
              </Button>
              <Button color="primary" onClick={()=>{
                console.log("Suppression du sondage " + this.state.i)
                this.setState({ openDialog: false })
              }}>
                Supprimer
              </Button>
            </DialogActions>
          </Dialog>
          )}}