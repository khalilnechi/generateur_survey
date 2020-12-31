import React from 'react';
import './App.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {Fade } from '@material-ui/core';

class AddResponseButton extends React.Component {
    render() {
        var maxRadio=4
        return (

            <span className="spanQuestion">
                <Fab
                    disabled={this.props.Tab.length === maxRadio}
                    size="small"
                    color="secondary"
                    aria-label="Add"
                    //href={"#footerQuestion"+this.props.num}
                    onClick={this.props.onClick} >
                    <AddIcon />

                </Fab>
                <Fade in={this.props.Tab.length === maxRadio}
                    style={{ marginLeft: 20, color: "white" }}>
                    <p >{maxRadio} choix au maximum</p>
                </Fade>
            </span>
        )
    }

}
export default AddResponseButton;