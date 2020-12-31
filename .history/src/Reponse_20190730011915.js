import React from 'react';
import './App.css';
import NavigationBar from './NavigationBar';
import * as firebase from 'firebase/app';
import TextField from '@material-ui/core/TextField';
import { Button } from 'react-bootstrap';

import Rating from 'material-ui-rating'
import RadioResponse from "./components/RadioReponse"
import CheckboxReponse from "./components/CheckboxReponse"
class Reponse extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var key=this.props.keyRep
        var num = key + 1
        console.log("key="+this.props.keyRep)
        console.log("this.props.Item="+JSON.stringify(this.props.Item))
        return (
            <div style={{
                border: '1px solid gray',
                borderRadius: 5,
                padding: 20,
                marginTop: 10,
                margin: 30,
                fontSize: 18,
            }}
                key={key}
                >
                <p >Q{num}. {this.props.Item.question} ?</p>

                {
                    this.props.this.props.Item.type_rep === "Zone de texte" &&
                    <TextField
                        id="outlined-with-placeholder"
                        label={"Réponse " + num}
                        placeholder={this.props.this.props.Item.question}
                        //  className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={(event) => {
                            this.state.Tab_Reponse[key].value = event.currentTarget.value
                            this.forceUpdate()
                        }}
                    />

                }
                {
                    this.props.Item.type_rep === "Zone de commentaire" &&
                    <TextField
                        id="outlined-multiline-flexible" label={"Réponse " + num}
                        multiline rowsMax="10" rows="5"
                        //style={{position:"relative",width:300,height:150}}
                        //value={values.multiline}
                        //onChange={handleChange('multiline')}
                        //className={classes.textField}
                        margin="normal"
                        // helperText="hello"
                        variant="outlined" fullWidth
                        onChange={(event) => {
                            this.state.Tab_Reponse[key].value = event.currentTarget.value
                            this.forceUpdate()
                        }}
                    />
                }
                {
                    this.props.Item.type_rep === "Choix multiple" &&
                    <RadioResponse Tab={this.props.Item.radioTab} onChange={(indexchecked) => {
                        //console.log("this.props.Item=" + JSON.stringify(this.props.Item))
                        this.state.Tab_Reponse[key].value = indexchecked
                        this.forceUpdate()

                    }}
                    // valuechecked={}
                    />
                }
                {
                    this.props.Item.type_rep === "Cases à cocher" &&
                    <CheckboxReponse Tab={this.props.Item.CheckboxTab} onChange={() => {
                        this.state.Tab_Reponse[key].value = this.props.Item.CheckboxTab
                        //   this.state.table_questions[key].CheckboxTab[k].checked=!this.state.table_questions[key].CheckboxTab[k].checked
                        //console.log(".CheckboxTab[0]="+JSON.stringify(this.state.table_questions[key].CheckboxTab[k]) )
                        this.forceUpdate()

                    }} />
                }
                {
                    this.props.Item.type_rep === "Evaluation par étoiles" &&
                    <Rating
                        value={this.state.Rate}
                        max={5}
                        onChange={(i) => {
                            //  console.log('onChange ' + i)
                            this.setState({ Rate: i })
                            this.state.Tab_Reponse[key].value = i
                        }}
                    />}

            </div>
        )





    }

}
export default Reponse;