import React from 'react';

import Switch from '@material-ui/core/Switch';
//import { purple } from '@material-ui/core/colors';
import {  Grow } from '@material-ui/core';
import { Form, Row, Col, Badge } from 'react-bootstrap';
import BoxRadio from './BoxRadio'
import AddResponseButton from './AddResponseButton'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import { RadioGroup, FormGroup } from '@material-ui/core';
import Rating from 'material-ui-rating'
class Question extends React.Component {

    constructor(props) {
        super(props)
        this.radioCheckedid = "0"
        this.state = {
            //obligatoire: true//statut_question
            heightCard: 550,
            groupSelect: "",
            AddEnable: true,
            value: "0"
        };
    }
    componentWillMount() {
        //console.log("CheckboxTab" + JSON.stringify(this.props.CheckboxTab))
        //console.log("radioTab" + JSON.stringify(this.props.radioTab))
    }
    render() {
        // var addingHeightForRadio = 0;
        var numeroQuestion = this.props.num+1;
        this.props.radioTab.forEach(element => {
            if (element.checked)
                this.radioCheckedid = element.id;

        });
        return (
            <Grow in={true}>
                <Card style={{
                    backgroundColor: "#353b48",
                    boxShadow: "4px 5px 3px #84817a",
                    margin: 20,
                    //padding:20,
                    borderRadius: 15,
                }}>
                    <CardActionArea
                        style={{
                            backgroundColor: "#353b48",
                            marginBottom: 10,
                            padding: 0,
                            boxShadow: "2px 3px 2px #84817a",
                        }}
                    >
                        <CardContent>
                            <Row>
                                <Col>
                                    <Typography style={{ color: "#dcdde1" }} variant="h5" component="h2">
                                        Question {this.props.num+1}
                                    </Typography>
                                </Col>
                                <Col style={{ textAlign: "right" }}  >
                                    <IconButton //className={classes.button} 
                                        aria-label="Delete" disabled={this.props.disabled}>

                                        <DeleteIcon style={{ color: this.props.disabled ? null : "#dcdde1" }}
                                            fontSize="large" onClick={() => {
                                                this.props.onDelete()
                                                this.forceUpdate()
                                            }}
                                        />
                                    </IconButton>

                                </Col>
                            </Row>
                        </CardContent>

                    </CardActionArea>



                    <Row style={{ margin: 10, marginTop: 20 }}>
                        <Col>
                            <Form.Control
                                type="text"
                                value={this.props.qst}
                                placeholder={"Question " + numeroQuestion}
                                onChange={(e) => {
                                    this.props.onChange("Question", e.target.value);
                                    this.forceUpdate();

                                }}
                            />

                            <Form.Label style={{ textAlign: "right", marginTop: 10, fontWeight: "bold", color: "white" }}>Type de réponse :</Form.Label>
                            <Row>
                                <Col style={{ display: "inline", width: 190 }}>
                                    <Form.Control style={{ display: "inline" }} as="select"
                                        value={this.props.TypeReponseDefaultValue}
                                        onChange={(option, index) => {
                                            //TypeReponseDefaultValue: la valeur ancienne du select 
                                            //option.currentTarget.value:la valeur actuelle du select 
                                            this.props.onChange("TypeRep", option.currentTarget.value);
                                            console.log(this.props.TypeReponseDefaultValue);
                                        }}
                                    >
                                        <option value="Zone de texte">Zone de texte</option>
                                        <option value="Zone de commentaire" >Zone de commentaire</option>
                                        <option value="Choix multiple">Choix multiple</option>
                                        <option value="Cases à cocher">Cases à cocher</option>
                                        <option value="Evaluation par étoiles">Evaluation par étoiles</option>
                                    </Form.Control>



                                </Col>
                                <Col>
                                    {
                                        /******************Zone de texte*************************************************************************/

                                        this.props.TypeReponseDefaultValue === "Zone de texte" &&
                                        <Form.Control
                                            style={{ margin: 15 }}
                                            type="text"
                                            placeholder={"Réponse " + this.props.num}
                                            disabled />
                                    }
                                    {
                                        /******************Zone de commentaire*************************************************************************/
                                        this.props.TypeReponseDefaultValue === "Zone de commentaire" &&
                                        <div>
                                            <textarea style={{ width: "30vmin", height: "5vmin" }} disabled></textarea>
                                        </div>
                                    }
                                    {

                                        /******************Choix multiple*************************************************************************/

                                        this.props.TypeReponseDefaultValue === "Choix multiple" &&

                                        <RadioGroup aria-label="position" name="position"
                                            value={this.radioCheckedid}
                                            onChange={(event) => {
                                                this.props.radioTab[event.target.value].checked = true
                                                this.props.radioTab.forEach(element => {
                                                    if (element.id === event.target.value)
                                                        element.checked = true;
                                                    else
                                                        element.checked = false;
                                                });
                                                // console.log("event.target.value=" + event.target.value + "=" + this.props.radioTab[event.target.value].checked)
                                                // console.log("this.props.radioTab=" + JSON.stringify(this.props.radioTab))
                                                this.setState({ value: event.target.value })
                                            }} >
                                            {
                                                this.props.radioTab.map((ItemRadio, keyRadio) => {
                                                    return (
                                                        <BoxRadio
                                                            type="Radio"
                                                            keyBox={keyRadio}
                                                            Item={ItemRadio}
                                                            onChange={(e) => {
                                                                console.log("onchange")
                                                                this.props.radioTab[keyRadio].label = e.target.value;
                                                                this.forceUpdate();
                                                                console.log(this.props.radioTab)
                                                            }}
                                                            IslastItem={(keyRadio > 1) && (this.props.radioTab.length - 1) === keyRadio}
                                                            onBoxDelete={() => {
                                                                if (keyRadio > 1)
                                                                    this.props.radioTab.splice(keyRadio, 1)
                                                                this.forceUpdate()
                                                            }}

                                                        />
                                                    )
                                                })
                                            }
                                            <AddResponseButton
                                                Tab={this.props.radioTab}
                                                onClick={() => {
                                                    console.log("Add" + this.props.radioTab.length)
                                                    this.props.onRadioAdd();
                                                }}
                                            />
                                        </RadioGroup>





                                    }
                                    {
                                        /******************Cases à cocher*************************************************************************/

                                        this.props.TypeReponseDefaultValue === "Cases à cocher" &&
                                        <FormGroup aria-label="position" name="position" value="0" onChange={(event) => {
                                            //this.props.CheckboxTab[event.target.value].checked = !this.props.CheckboxTab[event.target.value].checked

                                            //console.log("event.target.value=" + event.target.value + "=" + this.props.CheckboxTab[event.target.value].checked)
                                            console.log("this.props.CheckboxTab=" + JSON.stringify(this.props.CheckboxTab))
                                            this.setState({ value: event.target.value })
                                        }}
                                        >
                                            {
                                                this.props.CheckboxTab.map((ItemCheckbox, keyCheckbox) => {
                                                   // console.log("keyCheckbox=" + keyCheckbox)
                                                    //this.forceUpdate();
                                                    return (
                                                        <BoxRadio
                                                            type="Checkbox"
                                                            onChange={(e) => {
                                                                console.log("onchange")
                                                                this.props.CheckboxTab[keyCheckbox].label = e.target.value;
                                                                this.forceUpdate();
                                                                console.log(this.props.radioTab)
                                                            }}
                                                            key={keyCheckbox}
                                                            keyBox={keyCheckbox}
                                                            IslastItem={(keyCheckbox > 1) && (this.props.CheckboxTab.length - 1) === keyCheckbox}
                                                            Item={ItemCheckbox}
                                                            onBoxDelete={() => {
                                                                if (keyCheckbox > 1)
                                                                    this.props.CheckboxTab.splice(keyCheckbox, 1)
                                                                this.forceUpdate()
                                                            }}
                                                        />
                                                    )
                                                })
                                            }
                                            <AddResponseButton
                                                Tab={this.props.CheckboxTab}
                                                onClick={() => {
                                                    console.log("Add" + this.props.CheckboxTab.length)
                                                    this.props.onCheckboxAdd();
                                                }}
                                            />

                                        </FormGroup>
                                    }
                                    {
                                        /******************Evaluation par étoiles*************************************************************************/

                                        this.props.TypeReponseDefaultValue === "Evaluation par étoiles" &&

                                        <Rating
                                            value={3}
                                            max={5}
                                            onChange={(i) => console.log('onChange ' + i)}
                                        />
                                    }
                                </Col>

                            </Row>
                        </Col>
                        <Col style={{ textAlign: "right" }} >

                           
                        </Col>
                    </Row>






                </Card>
            </Grow >
        );
    }
/*Selectionner question obligatoire
 <div //id={"footerQuestion" + this.props.num}
                            >
                                <Switch color="default" height={20} width={40} onChange={() => {
                                    //this.setState({ obligatoire: !this.state.obligatoire })
                                    this.props.changer_statut()
                                    this.forceUpdate()
                                }}
                                    checked={this.props.obligatoire} />
                            </div>
                            <div>
                                <Badge style={{ backgroundColor: this.props.obligatoire ? "#218c74" : "grey", marginTop: 10 }} variant="danger">Obligatoire</Badge>
                            </div>
*/
}
export default Question;