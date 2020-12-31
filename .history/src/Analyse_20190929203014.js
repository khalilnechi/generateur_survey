import React from 'react';
import './App.css';
import NavigationBar from './NavigationBar';
import * as firebase from 'firebase/app';
import { Row, Col, Button, Modal, ButtonGroup } from 'react-bootstrap';
import Reponse from "./Reponse"
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Analyse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nombre_reponses: 0,
            Titre: "",
            Type: "",
            Statut_sondage: "",
            DateSondage: "",
            TimeSondage: "",
            Tab_reponses: [],
            table_questions: [],
            show: false,
            ReponseOwner: "",
            index: -1,
            Tab_Analyse: [],
            options: null,
            btnAnalyser: false
        }
    }
    componentWillMount() {
        try {
            var id = this.props.history.location.params.id_sondage

            firebase.database().ref("Sondage/" + id + "/Tab_Reponses").on('value', (Reponses) => {
                //console.log("Reponses.numChildren()=" + JSON.stringify(Reponses.numChildren()))
                if (Reponses.numChildren() !== 0) {
                    this.setState({ nombre_reponses: Reponses.numChildren() })
                    Reponses.forEach((rep) => {
                        //console.log("rep==" + JSON.stringify(rep.val()))
                        this.state.Tab_reponses.push({
                            User: rep.key,
                            UserName: rep.val().UserName,
                            UserResponse: rep.val().Reponses,
                            DateRep: rep.val().date,
                            TimeRep: rep.val().time,

                        })
                    })
                    // console.log("Rep:Tab_Analyse" + JSON.stringify(this.state.Tab_Analyse))
                    //console.log("this.state.Tab_reponses=" + JSON.stringify(this.state.Tab_reponses))
                }
            })
            firebase.database().ref("Sondage/" + id).once('value', (Sondage) => {
               // console.log("Sondage=" + Sondage.val().Titre)
                this.setState({
                    Titre: Sondage.val().Titre,
                    Type: Sondage.val().Type,
                    Statut_sondage: Sondage.val().Statut_sondage,
                    table_questions: Sondage.val().table_questions,
                    DateSondage: Sondage.val().date,
                    TimeSondage: Sondage.val().time
                })
            }).then(() => {
                this.state.table_questions.forEach((q, indexQuestion) => {
                    //Initialiser le tableau d'analyse

                    this.state.Tab_Analyse[indexQuestion] = []//initialiser chaque case de la table Tab_Analyse

                    if (q.type_rep === "Evaluation par étoiles")
                        this.state.Tab_Analyse[indexQuestion].push(
                            { label: "1 étoile", y: 0 },
                            { label: "2 étoiles", y: 0 },
                            { label: "3 étoiles", y: 0 },
                            { label: "4 étoiles", y: 0 },
                            { label: "5 étoiles", y: 0 }
                        )
                    else
                        if (q.type_rep === "Choix multiple" || q.type_rep === "Cases à cocher") {
                            let Tab_auxiliaire = []//Tab_auxiliaire va contenir soit la table radioTab ,soit la table CheckboxTab 
                            if (q.type_rep === "Choix multiple")
                                Tab_auxiliaire = q.radioTab
                            else
                                if (q.type_rep === "Cases à cocher")
                                    Tab_auxiliaire = q.CheckboxTab

                            Tab_auxiliaire.forEach((radio) => {
                                this.state.Tab_Analyse[indexQuestion].push({
                                    label: radio.label,
                                    y: 0
                                })
                            })

                        }





                    //console.log("Tab_Analyse" + JSON.stringify(this.state.Tab_Analyse))

                })
                this.state.Tab_reponses.forEach((rep) => {
                    rep.UserResponse.forEach((UserResponse, indexQuestion) => {
                        if (UserResponse.type_rep === "Choix multiple")
                            this.state.Tab_Analyse[indexQuestion][UserResponse.value].y++
                        else
                            if (UserResponse.type_rep === "Cases à cocher")
                                UserResponse.value.forEach((checkRep, indexCheck) => {
                                    if (checkRep.checked)
                                        this.state.Tab_Analyse[indexQuestion][indexCheck].y++
                                })
                        else
                            if (UserResponse.type_rep === "Evaluation par étoiles")
                             this.state.Tab_Analyse[indexQuestion][UserResponse.value-1].y++      


                        //else
                        //this.state.Tab_Analyse[indexQuestion]+=" "+question.value
                    })
                })
               // console.log("Rep:Tab_Analyse=" + JSON.stringify(this.state.Tab_Analyse))



            })


        }
        catch (e) {
            alert("Vous allez quitter la page");
            this.props.history.push({
                pathname: '/Consultation_survey/'
            })
        }

    }

    render() {
        return (

            <div className="App">

                <NavigationBar history={this.props.history} Activelink="Analyser les résultats" />
                <div
                    style={{
                        border: '1px solid black',
                        margin: 20,
                        textAlign: "left",
                        padding: 30,
                        paddingLeft: 100
                    }}>
                    <Row>
                        <Col>
                            <span style={{ fontSize: 70, fontWeight: "bold", color: "gray" }}>{this.state.nombre_reponses}</span><p>Réponses</p>
                        </Col>
                        <Col>
                            Titre :
                    <span style={{ fontSize: 20, fontWeight: "bold" }}> {this.state.Titre}</span>
                            <p>
                                Type :
                    <span style={{ fontSize: 20, fontWeight: "bold" }}>  {this.state.Type}</span></p>
                            <p>
                                Crée le :
                    <span style={{ fontSize: 20, }}>  {this.state.DateSondage + " à " + this.state.TimeSondage}</span></p>
                            <p>
                                Statut :
                    <span style={{ fontSize: 20, }}>  {this.state.Statut_sondage}</span></p>

                        </Col>
                    </Row>


                    <div className="d-flex flex-column">
                        <ButtonGroup size="lg">
                            <Button
                                disabled={this.state.nombre_reponses===0 || this.state.btnAnalyser}
                                onClick={() => {
                                    this.setState({
                                        btnAnalyser: true
                                    })
                                }}>
                                Analyser par question</Button>
                            <Button
                                disabled={this.state.nombre_reponses===0 || !this.state.btnAnalyser}
                                onClick={() => {
                                    this.setState({
                                        btnAnalyser: false
                                    })
                                }}>Consulter les réponses</Button>
                        </ButtonGroup>
                    </div>
                </div>
                {this.state.nombre_reponses === 0 ?
                    <h5>Aucune réponse ...</h5>
                    :
                    <div>
                        {
                            this.state.btnAnalyser ?
                                <div>

                                    {
                                        this.state.Tab_Analyse.map((Analyse, index) => {
                                            var num_question = index + 1;
                                            var type="pie"
                                            if (this.state.table_questions[index].type_rep === "Evaluation par étoiles")
                                                 type = "bar"
                                            
                                            const options = {
                                                animationEnabled: true,
                                                exportEnabled: true,
                                                theme: "dark1", // "light1", "dark1", "dark2"
                                                title: {
                                                    text: "Question " + num_question + " : " + this.state.table_questions[index].question
                                                },
                                                data: [{
                                                    type: type,
                                                    indexLabel: "{label}: {y} personne(s)",
                                                    startAngle: -90,
                                                    dataPoints: Analyse
                                                }]
                                            }
                                            return (
                                                <div key={index} style={{ margin: 15 }}>
                                                    <CanvasJSChart options={options} /* onRef = {ref => this.chart = ref} */
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                :
                                <div>
                                    {
                                        this.state.Tab_reponses.map((Reponse, index) => {
                                            return (
                                                <Row
                                                    key={index}
                                                    style={{
                                                        border: '1px solid black',
                                                        margin: 20,
                                                        textAlign: "left",
                                                        padding: 20,
                                                        paddingLeft: 50,

                                                    }} >
                                                    <Col>Répondu par :<p style={{ fontWeight: "bold" }}>{Reponse.UserName}</p>
                                                        <p>Répondu le : {Reponse.DateRep} à {Reponse.TimeRep}</p></Col>
                                                    <Col style={{ textAlign: "right" }}>
                                                        <Button variant="outline-primary" onClick={() => {
                                                            /*this.props.history.push({
                                                                 pathname: '/Afficher_survey/',
                                                                 params: {
                                                                     id_sondage: this.props.history.location.params.id_sondage,
                                                                     user_uid: Reponse._key
                                                                 }
                                                             })*/

                                                            this.setState({
                                                                index: index,
                                                                show: true,
                                                                ReponseOwner: Reponse.UserName
                                                            }, () => {
                                                               // console.log("this.state.Tab_reponses[" + this.state.index + "]=" + JSON.stringify(Reponse))
                                                               // console.log("index=" + index)
                                                                console.log("click on " + Reponse.UserName)
                                                            })



                                                        }}>Ouvrir</Button>
                                                    </Col>

                                                </Row>

                                            )
                                        })
                                    }
                                </div>

                        }
                   </div> 
                }
                {
                    this.state.index === -1 ?
                        null
                        :
                        <Modal
                            show={this.state.show}
                            onHide={() => {
                                //console.log("hide")

                                this.setState({ show: false })
                            }}
                            dialogClassName="modal-90w"
                            aria-labelledby="example-custom-modal-styling-title"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="example-custom-modal-styling-title">
                                    {this.state.ReponseOwner}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>

                                <div style={{ textAlign: "center", padding: 20, }}>
                                    <h4>date</h4>
                                </div>

                                {
                                    this.state.table_questions.map((Item, key) => {
                                        //console.log(this.state.Tab_reponses[this.state.index].UserResponse[key].value)
                                        return (
                                            <Reponse
                                                Item={Item}
                                                key={key}
                                                keyRep={key}
                                                value={this.state.Tab_reponses[this.state.index].UserResponse[key].value}

                                                disabled={true}
                                            />
                                        )
                                    })
                                }

                            </Modal.Body>
                        </Modal>
                }
            </div>
        );

    }
}

export default Analyse;
