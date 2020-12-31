import React from 'react';
import './App.css';
import TextField from '@material-ui/core/TextField';

import Rating from 'material-ui-rating'
import RadioResponse from "./components/RadioReponse"
import CheckboxReponse from "./components/CheckboxReponse"
class Reponse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Rate:0
        }
    }

    render() {
        var key=this.props.keyRep
        var num = key + 1
        //console.log("key="+this.props.keyRep)
        //console.log("this.props.Item="+JSON.stringify(this.props.Item))
        return (
            <div className="ReponseDiv"
                key={key}
                >
                <p >Q{num}. {this.props.Item.question} ?</p>

                {
                    this.props.Item.type_rep === "Zone de texte" &&
                    <TextField
                        id="outlined-with-placeholder"
                        label={"Réponse " + num}
                        placeholder={this.props.Item.question}
                        //  className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        onChange={(event)=>{this.props.onChange(event)}}
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
                        onChange={(event)=>{this.props.onChange(event)}}
                    />
                }
                {
                    this.props.Item.type_rep === "Choix multiple" &&
                    <RadioResponse Tab={this.props.Item.radioTab} onChange={(indexchecked) => {
                        //console.log("this.props.Item=" + JSON.stringify(this.props.Item))
                        this.props.onRadioChange(indexchecked)
                    }}
                    // valuechecked={}
                    />
                }
                {
                    this.props.Item.type_rep === "Cases à cocher" &&
                    <CheckboxReponse Tab={this.props.Item.CheckboxTab} onChange={() => {
                        this.props.onCheckBoxChange()

                    }} />
                }
                {
                    this.props.Item.type_rep === "Evaluation par étoiles" &&
                    <Rating
                        value={this.state.Rate}
                        max={5}
                        onChange={(star) => {
                            //  console.log('onChange ' + i)
                            this.setState({ Rate: star })
                            this.props.onRatingChange(star)
                            this.forceUpdate()
                            
                        }}
                    />}

            </div>
        )





    }

}
export default Reponse;