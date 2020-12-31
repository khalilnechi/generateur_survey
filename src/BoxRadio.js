import React from 'react';
import './App.css';
import { Radio, FormControlLabel, Checkbox } from '@material-ui/core';
import { Slide, Box } from '@material-ui/core';
import { Form, Row, Col } from 'react-bootstrap';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

class BoxRadio extends React.Component {

    render() {
        return (
            <Slide in={true} key={this.props.keyBox}>
                <Box
                boxShadow={10}
                    component="div" m={1} className="BoxRadio"
                >
                    <Row >
                        <Col>
                            {
                                this.props.type === "Radio" ?
                                    <FormControlLabel
                                        value={this.props.Item.id}
                                        control={<Radio color="primary" />}
                                        //label={this.props.Item.id}
                                        labelPlacement="end"
                                        disabled
                                    />
                                    :
                                    <FormControlLabel
                                        value={this.props.Item.id}
                                        control={<Checkbox color="primary" />}
                                        labelPlacement="end"
                                        // style={{margin:0}}
                                        disabled
                                    />
                            }
                           </Col>
                           <Col style={{textAlign:"right"}}>  
                            {
                                this.props.IslastItem ?
                                    <IconButton //className={classes.button} 
                                        aria-label="Delete" disabled={this.props.disabled}>
                                        <DeleteIcon style={{ color: this.props.disabled ? null : "#4b4b4b" }}
                                            fontSize="small" onClick={() => {
                                                this.props.onBoxDelete()
                                                this.forceUpdate()
                                            }}
                                        />
                                    </IconButton>
                                    :
                                    null
                            }
                        </Col>
                    </Row>
                    <Form.Control
                        style={{ display: "inline" }}
                        type="text"
                        value={this.props.Item.label}
                        onChange={(e) => { this.props.onChange(e) }}
                        placeholder={"Réponse " + this.props.Item.id}
                    />
                </Box>
            </Slide>
        )
    }

}
export default BoxRadio;