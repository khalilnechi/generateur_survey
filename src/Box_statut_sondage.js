import React from 'react';
import './App.css';
import {  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@material-ui/core';

class Box_statut_sondage extends React.Component {
    render() {
        return (

            <FormControl style={{
                border: '2px solid gray',
                borderRadius: 5,
                marginTop: 20,
                padding: 10,
                elevation: 6,
                boxShadow: "2px 3px 2px #84817a",
            }}>
                <FormLabel>Statut du sondage</FormLabel>
                <RadioGroup aria-label="position" name="position"
                    value={this.props.Statut_sondage}
                    onChange={(event) => { this.props.onChange(event) }} row>

                    <FormControlLabel
                        value="Public"
                        control={<Radio checked={this.props.Statut_sondage === "Public"} color="secondary" />}
                        label="Public"
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value={this.props.Team}
                        control={<Radio color="secondary"/>}
                        label={this.props.Team}
                        labelPlacement="end"
                    />
                    <FormControlLabel
                        value="Privé"
                        control={<Radio  color="secondary" />}
                        label="Private"
                        labelPlacement="end"
                    />
                </RadioGroup>
            </FormControl>
        )
    }

}
export default Box_statut_sondage;