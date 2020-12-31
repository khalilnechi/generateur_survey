import React from 'react';


import { Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
class RadioReponse extends React.Component {

    render() {

        return (
            <RadioGroup
                aria-label="Gender"
                name="gender1"
                value={this.props.value !== undefined ? this.props.value.toString() : null}
                defaultValue="0"
            // className={classes.group}
            //onChange={handleChange}
            >{
                    this.props.Tab.map((ItemReponse, key) => {
                        return (
                            <FormControlLabel key={key}  //checked={ItemReponse.checked} 
                                value={ItemReponse.id} onChange={() => {

                                    this.props.Tab.forEach((element, key) => {
                                        element.checked = false;
                                    });
                                    ItemReponse.checked = true
                                    this.props.onChange(key)

                                }} control={<Radio />} label={ItemReponse.label} disabled={this.props.disabled} />
                        )
                    })
                }


            </RadioGroup>
        );
    }

}
export default RadioReponse;