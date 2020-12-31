import React from 'react';
import { Checkbox, FormControl, FormGroup, FormControlLabel } from '@material-ui/core';
class CheckboxReponse extends React.Component {

    render() {

        return (
            <FormControl component="fieldset" value="qq" >
                <FormGroup value="qq">
                    {
                        this.props.Tab.map((ItemReponse, key) => {
                            return (
                                <FormControlLabel
                                    key={key}
                                    control={<Checkbox checked={ItemReponse.checked}
                                        onChange={() => {
                                            this.props.onChange()
                                            ItemReponse.checked = !ItemReponse.checked
                                            this.forceUpdate()
                                        }}
                                        value={ItemReponse.label} />}
                                    label={ItemReponse.label}
                                    disabled={this.props.disabled}
                                />
                            )
                        })
                    }


                </FormGroup>
            </FormControl>
        );
    }

}
export default CheckboxReponse;