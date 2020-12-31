import React from 'react';
import './App.css';
import NavigationBar from './NavigationBar';
import * as firebase from 'firebase/app';
import { Button } from 'react-bootstrap';

import Reponse from "./Reponse"
class Afficher_survey extends React.Component {
    constructor(props) {
        super(props)
        var id
        try {
            id = this.props.history.location.params.id_sondage
           // console.log("non null")
        } catch (error) {
            id = -2
           // console.log("Afficher_survey:Erreur" + error)
        }


        this.state = {
            ID: id,
            user: null,
            Titre: "",
            Type: "",
            Statut_sondage: "",
            table_questions: [],
            Rate: 0,
            Tab_Reponse: []
        }
        this.ValiderReponse = this.ValiderReponse.bind(this)

    }

    ValiderReponse() {
        //console.log("Sondage " + this.state.ID + ": Validation de votre réponse...")

        firebase.database().ref('Users/' + this.state.user.uid + "/displayName").once("value", (UserName) => {
            //console.log("user " + UserName.val())
            let newDate = new Date()
            let date = newDate.getDate();
            let month = newDate.getMonth() + 1;
            let year = newDate.getFullYear();
            var fullDate = date + "/" + month + "/" + year;
            var min = new Date().getMinutes(); //Current Minutes
            var hour = new Date().getHours();
            if (min >= 0 && min <= 9)
                min = "0" + min

            if (hour >= 0 && hour <= 9)
                hour = "0" + hour
                var time=hour + ":" + min
            //console.log(time)
            firebase.database().ref('Sondage/' + this.state.ID + "/Tab_Reponses/" + this.state.user.uid).set({
                date: fullDate,
                time:time,
                UserName: UserName.val(),
                Reponses: this.state.Tab_Reponse
            }).then(() => {
                this.props.history.push({
                    pathname: "/Consultation_survey/",
                    params: {
                        user: this.state.user
                    }
                })
            })
        })

    }

    componentWillMount() {

       // console.log("Afficher_survey:componentWillMount():" + this.state.user)
       // console.log("this.state.ID=" + this.state.ID)
        if (this.state.ID === -2)
            this.props.history.push({
                pathname: "/",
            })
        else
            firebase.auth().onAuthStateChanged((user) => {
             //   console.log("onAuthStateChanged")
              //  console.log("user=" + JSON.stringify(user))


                if (user) {
                  //  console.log("you are connected")
                    this.setState({ user: user })

                    firebase.database().ref('Sondage/' + this.state.ID).once('value', (sondage) => {
                        // this.state.table_questions=sondage
                        this.setState({
                            Titre: sondage.val().Titre,
                            Type: sondage.val().Type,
                            Statut_sondage: sondage.val().Statut_sondage,
                            table_questions: sondage.val().table_questions
                        })

                    }).then(() => {
                        //initialisation de la table des réponses
                        for (var i = 0; i < this.state.table_questions.length; i++) {
                            var valueRep
                            if (this.state.table_questions[i].type_rep === "Cases à cocher")
                                valueRep = this.state.table_questions[i].CheckboxTab;
                            else
                                if (this.state.table_questions[i].type_rep === "Choix multiple" || this.state.table_questions[i].type_rep === "Evaluation par étoiles")
                                    valueRep = 0
                                else
                                    valueRep = ""


                            this.state.Tab_Reponse[i] = {
                                type_rep: this.state.table_questions[i].type_rep,
                                value: valueRep
                            }
                        }

                       // console.log("Tab_Reponse=" + JSON.stringify(this.state.Tab_Reponse))
                    })
                }


            })

    }
    render() {
       // console.log(JSON.stringify(this.state.Tab_Reponse))

        if (this.state.user === null)
            return (<div>loa</div>)
        else
            if (this.state.Titre !== "")
                return (
                    <div>
                        <NavigationBar history={this.props.history} />
                        <div style={{
                            position: "absolute",
                            right: 10,
                            border: '1px solid black',
                            borderRadius: 5,
                            padding: 5,
                            marginTop: 10,
                            fontWeight: "fontWeightLight",
                            fontSize: 18,
                            fontFamily: "Roboto",
                        }}> {this.state.Statut_sondage} </div>

                        <div style={{ textAlign: "center", padding: 20, }}>
                            <h1>{this.state.Titre}</h1>
                        </div>


                        {

                            this.state.table_questions.map((Item, key) => {
                                //console.log("item=" + JSON.stringify(Item))

                                return (

                                    <Reponse
                                        Item={Item}
                                        key={key}
                                        keyRep={key}
                                        onChange={(event) => {
                                            this.state.Tab_Reponse[key].value = event.currentTarget.value
                                            this.forceUpdate()
                                        }}
                                        onRatingChange={(star) => this.state.Tab_Reponse[key].value = star}
                                        onRadioChange={(indexchecked) => {
                                            this.state.Tab_Reponse[key].value = indexchecked
                                            this.forceUpdate()
                                        }
                                        }
                                        onCheckBoxChange={() => {
                                            this.state.Tab_Reponse[key].value = Item.CheckboxTab
                                            this.forceUpdate()
                                        }}
                                    />
                                )
                            })


                        }
                        <footer id="footer" style={{ textAlign: "center" }}>
                            <Button variant="outline-info" style={{ borderRadius: 30, margin: 10 }} //href="/Consultation_survey"
                                onClick={this.ValiderReponse}>Valider la réponse</Button>
                        </footer>
                    </div>
                )
            else
                return (
                    <p>loading</p>)
    }

}
export default Afficher_survey;