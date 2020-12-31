import React from 'react';
import './App.css';
import NavigationBar from './NavigationBar';
import { Button, Form } from 'react-bootstrap';
import Question from './Question'
import Box_statut_sondage from './Box_statut_sondage'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Redirect } from 'react-router-dom'
import { TextField } from '@material-ui/core';
import * as firebase from 'firebase/app';
import MySnackbarContentWrapper from "./MySnackbarContentWrapper"
import Snackbar from '@material-ui/core/Snackbar';
import SearchUserBox from './components/SearchUserBox'
import Collapse from '@material-ui/core/Collapse';


/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */
/********************************************************************************************************************** */

// La page permettant de créer un nouveau sodage
class Creation_survey extends React.Component {
    constructor(props) {
        super(props)
        this.defaultselect = "Zone de texte"
        var id;
        try {
            id = this.props.history.location.params.id_sondage
        }
        catch (e) {
            id = -2
        }

        this.state = {
            ID: id,
            user: null,
            Titre: "",
            Type: "Feedback",
            Statut_sondage: "Public",
            table_questions: [{
                question: "",
                type_rep: this.defaultselect,
                obligatoire: true,
                radioTab: [{
                    id: "0",
                    checked: true,
                    label: ""
                },
                {
                    id: "1",
                    checked: false,
                    label: ""
                }],
                CheckboxTab: [{
                    id: "0",
                    checked: false,
                    label: ""
                },
                {
                    id: "1",
                    checked: false,
                    label: ""
                }],
            }],
            push: false,
            SnackBarOpen: false,
            WarningSnackBarOpen: false,
            Team: "null",
            selected_mails: []
        };

        this.ajouterQuestion = this.ajouterQuestion.bind(this);
        this.changer_statut = this.changer_statut.bind(this);
        this.valider_survey = this.valider_survey.bind(this);
    }
    /********************************************************************************************************************** */
    /********************************************************************************************************************** */
    /********************************************************************************************************************** */
    /********************************************************************************************************************** */
    /********************************************************************************************************************** */
    /******************************************* Les Méthodes ************************************************************* */
    /********************************************************************************************************************** */
    /********************************************************************************************************************** */
    /********************************************************************************************************************** */
    /********************************************************************************************************************** */
    /********************************************************************************************************************** */
    ajouterQuestion() {
        console.log("ajouterQuestion")
        this.setState({
            table_questions: this.state.table_questions.concat([{
                question: "",
                type_rep: this.defaultselect,
                obligatoire: true,
                radioTab: [{
                    id: "0",
                    checked: true,
                    label: ""
                },
                {
                    id: "1",
                    checked: false,
                    label: ""
                }],
                CheckboxTab: [{
                    id: "0",
                    checked: false,
                    label: ""
                },
                {
                    id: "1",
                    checked: false,
                    label: ""
                }]
            }])
        })
    }
    /********************************************************************************************************************** */
    changer_statut(key) {
        if (this.state.table_questions.length === 1) {
            this.state.table_questions[0].obligatoire = true
            this.setState({
                WarningSnackBarOpen: true,
                SnackBarOpen: false
            })
        }
        else {
            this.setState(() => {
                this.state.table_questions[key].obligatoire = !this.state.table_questions[key].obligatoire
            })
        }
        this.forceUpdate()
    }
    /********************************************************************************************************************** */
    TestChampsVides() {
        var i = 0
        var champsvide = false
        if (this.state.Titre === "") {
            champsvide = true//titre du sondage vide
        }
        else {

            while (i < this.state.table_questions.length && !champsvide) {//parcourir les questions
                if (this.state.table_questions[i].question === "")
                    champsvide = true;//question vide
                else
                    if (this.state.table_questions[i].type_rep === "Cases à cocher" || this.state.table_questions[i].type_rep === "Choix multiple") {
                        var Table_testvide
                        if (this.state.table_questions[i].type_rep === "Cases à cocher") {
                            Table_testvide = this.state.table_questions[i].CheckboxTab;
                        }
                        else
                            if (this.state.table_questions[i].type_rep === "Choix multiple") {
                                Table_testvide = this.state.table_questions[i].radioTab;
                            }

                        var indice_checkbox_vide = Table_testvide.findIndex(checkItem => { return checkItem.label === "" })
                        if (indice_checkbox_vide === -1)
                            i++
                        else
                            champsvide = true//au moins une des cases du checkbox ou radiobox (selon le choix) est vide

                        //console.log("indice_checkbox_vide" + i + "=" + indice_checkbox_vide);

                        //console.log("champsvide=" + champsvide);
                    }
                    else
                        i++;
            }
        }
        return champsvide;
    }
    /********************************************************************************************************************** */
    // Enregistrement du sondage
    valider_survey() {
        console.log("TestChampsVides()=" + this.TestChampsVides())
        if (this.TestChampsVides() === true)// true : il y a un champs vide   // false : Tous les champs ont été rempli
        {
            this.setState({
                SnackBarOpen: true,
                WarningSnackBarOpen: false
            })
        }
        else {
            firebase.database().ref('nb_sondage').once('value', (snapshot) => {
                console.log("nb_sondage=" + snapshot.val())
                var IdSondage = parseInt(this.state.ID)
                if (IdSondage !== -1) {//Modification d'un sondage
                    console.log("Modification d'un sondage")
                }
                else {//Creation d'un sondage
                    IdSondage = parseInt(snapshot.val() + 1);
                    firebase.database().ref('nb_sondage').set(IdSondage)
                }
                let newDate = new Date();
                let date = newDate.getDate(); let month = newDate.getMonth() + 1; let year = newDate.getFullYear();
                var fullDate = date + "/" + month + "/" + year;
                var min = new Date().getMinutes(); //minute actuel
                var hour = new Date().getHours();//heure actuel
                if (min >= 0 && min <= 9)
                    min = "0" + min
                if (hour >= 0 && hour <= 9)
                    hour = "0" + hour
                var time = hour + ":" + min

                var private_viewers = [];
                if (this.state.selected_mails !== null)
                    this.state.selected_mails.forEach((element) => {
                        private_viewers.push(element.label)
                    })
                //console.log("private_viewers=" + JSON.stringify(private_viewers))

                //Ecriture dans la base de données
                firebase.database().ref('Sondage/' + IdSondage).set({
                    owner: this.state.user.displayName,
                    owner_uid: this.state.user.uid,
                    Titre: this.state.Titre,
                    Type: this.state.Type,
                    Statut_sondage: this.state.Statut_sondage,
                    table_questions: this.state.table_questions,
                    date: fullDate,
                    time: time,
                    private_viewers: private_viewers
                }).then(() => {
                    //this.setState({ push: true })//go to consultation_survey
                    this.props.history.push({
                        pathname: "/Consultation_survey/",
                        params: {
                            user: this.state.user
                        }
                    })
                });
            });

        }
    }
    /********************************************************************************************************************** */
    componentWillMount() {

        if (this.state.ID === -2) {
            alert("Vous pouvez seulement accéder à cette page en cliquant sur la bouton 'Modifier' dans la page Tous les sondages")
            this.props.history.push({
                pathname: "/Consultation_survey/",
            })
        }
        else
            if (this.state.user === null)
                firebase.auth().onAuthStateChanged((user) => {
                    //console.log("onAuthStateChanged")
                    if (user) {
                        // console.log("you are connected")
                        firebase.database().ref("Users/" + user.uid + "/Team").once('value', (Team) => {
                            this.setState({
                                Team: Team.val(),
                                user: user
                            })
                        }).then(() => {
                            //Importation de la liste des utilisateurs (en cas ou on veut les utiliser pour créer un sondage privé)
                            firebase.database().ref("Table_Users").once("value", (users) => {
                                const suggestions = []
                                users.forEach((user) => {
                                    if (user.val().email !== this.state.user.email)
                                        suggestions.push({
                                            value: user.val().email,
                                            label: user.val().email
                                        })

                                })
                                this.setState({
                                    suggestions: suggestions
                                })
                            }).then(() => {
                                console.log("Importation de la liste des utilisateurs")
                            })
                        })

                        this.setState({ user: user })
                        if (this.state.ID != -1) {//Modification du sondage
                            //console.log(" this.state.ID=" + this.state.ID)

                            firebase.database().ref('Sondage/' + this.state.ID).on('value', (sondage) => {
                                console.log("Importation de la base de données")
                                var Mails = [];
                                sondage.val().private_viewers.forEach((mail) => {
                                    Mails.push({ value: mail, label: mail })
                                })
                                console.log("Mails=" + JSON.stringify(Mails))

                                this.setState({
                                    Titre: sondage.val().Titre,
                                    Type: sondage.val().Type,
                                    Statut_sondage: sondage.val().Statut_sondage,
                                    table_questions: sondage.val().table_questions,
                                    selected_mails: [{"value":"assyl.elyahmadi@newaccess.ch","label":"assyl.elyahmadi@newaccess.ch"},{"value":"Sami.jrad@newaccess.ch","label":"Sami.jrad@newaccess.ch"}]
                                }, () => {
                                    console.log("selected_mails=" + this.state.selected_mails)
                                    //this.forceUpdate()
                                })
                            })
                        }
                    }
                })
    }
    /*************************************************La fonction Render()*********************************************************************************/
    render() {
        // console.log("render:ID=" + this.state.ID)
        console.log("=============>render=" + JSON.stringify(this.state.selected_mails))
        return (

            <div className="App">
                <NavigationBar history={this.props.history} user={this.state.user} Activelink="Créer un sondage" />
                <div style={{ backgroundColor: "", marginTop: 20 }}>

                    <TextField
                        id="outlined-with-placeholder"
                        label="Titre du sondage"
                        placeholder="Indiquer le titre de votre sondage"
                        className="TextField_Creation_survey"
                        margin="normal"
                        variant="outlined"
                        value={this.state.Titre}
                        onChange={(e) => { this.setState({ Titre: e.currentTarget.value }); }}
                    />
                    <br />
                    <Form.Control style={{ display: "inline", width: 250 }} as="select"
                        value={this.state.Type}
                        onChange={(event) => {
                            //TypeReponseDefaultValue: la valeur ancienne du select 
                            //option.currentTarget.value:la valeur actuelle du select 
                            this.setState({ Type: event.currentTarget.value })
                        }}
                    >
                        <option value="Feedback">Feedback</option>
                        <option value="Team building" >Team building</option>
                        <option value="Autre">Autre</option>
                    </Form.Control>
                    <br />
                    <Box_statut_sondage
                        Team={this.state.Team}
                        onChange={(event) => {
                            this.setState({ Statut_sondage: event.target.value })
                        }}
                        Statut_sondage={this.state.Statut_sondage} />
                    <Collapse in={this.state.Statut_sondage === "Privé"}>
                        <SearchUserBox options={this.state.suggestions}
                            onChange={(value) => {
                                this.setState({
                                    selected_mails: value
                                }
                                )
                            }}
                            defaultValue={[this.state.selected_mails]}
                        />

                    </Collapse>
                </div>


                <Form style={{ padding: 20 }}>
                    {

                        this.state.table_questions.map((Item, key) => {
                            return (
                                /*******************************************************************************************************************************************/
                                /*******************************************************************************************************************************************/
                                /*******************************************************************************************************************************************/
                                /********************************************************Question***************************************************************************/
                                /*******************************************************************************************************************************************/
                                /*******************************************************************************************************************************************/
                                /*******************************************************************************************************************************************/
                                <Question
                                    qst={this.state.table_questions[key].question}
                                    num={key}
                                    key={key}
                                    TypeReponseDefaultValue={Item.type_rep}
                                    obligatoire={this.state.table_questions[key].obligatoire}
                                    radioTab={this.state.table_questions[key].radioTab}
                                    CheckboxTab={this.state.table_questions[key].CheckboxTab}
                                    ItemQuestion={this.state.table_questions[key]}
                                    disabled={this.state.table_questions.length === 1}
                                    changer_statut={() => { this.changer_statut(key); }}
                                    onChange={(typeInput, texte) => {
                                        switch (typeInput) {
                                            case "Question":
                                                Item.question = texte; break;
                                            case "TypeRep":
                                                Item.type_rep = texte; break;
                                        }
                                        this.forceUpdate()
                                    }}
                                    onDelete={() => {
                                        //console.log("deletequestion" + key)
                                        this.state.table_questions.splice(key, 1)
                                        this.forceUpdate()
                                        if (this.state.table_questions.length === 1 && this.state.table_questions[0].obligatoire === false) {
                                            this.state.table_questions[0].obligatoire = true
                                            this.setState({ WarningSnackBarOpen: true })
                                        }
                                    }
                                    }
                                    onRadioAdd={() => {
                                        this.state.table_questions[key].radioTab = this.state.table_questions[key].radioTab.concat([{
                                            id: this.state.table_questions[key].radioTab.length.toString(),
                                            checked: false,
                                            label: ""
                                        }])

                                        this.forceUpdate()
                                    }}
                                    onCheckboxAdd={() => {
                                        this.state.table_questions[key].CheckboxTab = this.state.table_questions[key].CheckboxTab.concat([{
                                            id: this.state.table_questions[key].CheckboxTab.length.toString(),
                                            checked: false,
                                            label: ""
                                        }])

                                        this.forceUpdate()
                                    }}
                                />
                            )
                        })
                    }

                    <Fab
                        size="large"
                        color="primary"
                        aria-label="Add"
                        href="#footer"
                        onClick={this.ajouterQuestion} >
                        <AddIcon />
                    </Fab>
                </Form>

                <div>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        open={this.state.SnackBarOpen}
                        autoHideDuration={2000}
                    >
                        <MySnackbarContentWrapper
                            onClose={() => {
                                //console.log("close")
                                this.setState({ SnackBarOpen: false })
                            }}
                            variant="error"
                            message="Il y a des champs vides!"
                        />
                    </Snackbar>
                </div>

                <footer id="footer">
                    <Button variant="outline-info" style={{ borderRadius: 30, margin: 10 }} //href="/Consultation_survey"
                        onClick={this.valider_survey}>Valider</Button>
                </footer>
                {
                    this.state.push ?
                        <Redirect to="/Consultation_survey" push={false} />
                        :
                        null
                }
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={this.state.WarningSnackBarOpen}
                    autoHideDuration={2000}
                >
                    <MySnackbarContentWrapper
                        onClose={() => {
                            this.setState({ WarningSnackBarOpen: false })
                        }}
                        variant="warning"
                        message="Une seule question doit être obligatoire!"
                    />
                </Snackbar>
            </div>
        );
        /*********************************************************************************************************************************/

    }
}

export default Creation_survey;
