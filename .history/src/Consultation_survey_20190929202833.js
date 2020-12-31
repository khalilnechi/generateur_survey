import React from 'react';
import './App.css';
import NavigationBar from './NavigationBar';
import { Row } from 'react-bootstrap';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
//import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Box, Fade } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Switch from '@material-ui/core/Switch';
import * as firebase from 'firebase/app';
import ConfirmationSuppression from './components/ConfirmationSuppression'


class Consultation_survey extends React.Component {
    constructor(props) {
        super(props)
        // State
        this.state = {
            user: null,
            table_survey: [],
            openDialog: false,
            TousSondages: true,
            ItemToDelete: "",
            Team: ""
        }
        //this.supprimer_survey=this.supprimer_survey.bind(this)
    }
    setTableSurvey(sondages) {
        sondages.forEach(child => {
            //console.log("ok")
            //console.log("child.val.Réponses=" + JSON.stringify(child.val().Réponses))
            var responseExist = false
            try {
                responseExist = child.val().Tab_Reponses[this.state.user.uid]
                // console.log("====>" + this.state.user.uid + " element=" + child.val().Réponses[this.state.user.uid])
                if (child.val().Tab_Reponses[this.state.user.uid] === undefined) {
                    responseExist = false
                    //  console.log(this.state.user.uid + " n'a pas deja répondu")
                }
                else {
                    responseExist = true
                    // console.log(this.state.user.uid + " a deja répondu")
                }
            }
            catch (e) {
                responseExist = false
                // console.log("catch():l'utilisateur n'a pas deja répondu")
            }
            //privateAccess donne l'accès à copier le sondage si ce sondage est public ou "Team(APSYS,CIM...)"
            //sinon si ce sondage est privé on teste si ce compte a l'accès pour voir ce sondage
            var privateAccess
            if(child.val().Statut_sondage==="Privé" && child.val().owner_uid !== this.state.user.uid)
              {
                privateAccess= child.val().private_viewers.includes(this.state.user.email)
              }
              else
              privateAccess=true

            if (privateAccess)
                if (this.state.TousSondages || (this.state.TousSondages === false && (child.val().owner_uid === this.state.user.uid)))
                    this.state.table_survey.push({
                        _key: child.key,
                        Statut_sondage: child.val().Statut_sondage,
                        Titre: child.val().Titre,
                        Type: child.val().Type,
                        owner: child.val().owner,
                        owner_uid: child.val().owner_uid,
                        hasAlreadyresponded: responseExist,
                        date: child.val().date,
                        time: child.val().time,

                    });
        });

        this.setState({ table_survey: [...this.state.table_survey] })

    }
    importerTablesurvey(all) {
        //console.log("Importation de la table survey: tous les sondages=" + all)
        this.setState({ table_survey: [] })  //this.state.table_survey = []

        //importation des sondages publics
        firebase.database().ref('Sondage').orderByChild("Statut_sondage").equalTo("Public").once('value', (sondagesPublic) => {
            this.setTableSurvey(sondagesPublic)
        });

        //importation des sondages Team( APSYS, CIM, QA ...)
        firebase.database().ref('Sondage').orderByChild("Statut_sondage").equalTo(this.state.Team).once('value', (sondagesTeam) => {
            this.setTableSurvey(sondagesTeam)
        });
        //importation des sondages Privés( Selon le champs "private_viewers")
        firebase.database().ref('Sondage').orderByChild("Statut_sondage").equalTo("Privé").once('value', (sondagesPrivate) => {
            this.setTableSurvey(sondagesPrivate)
        });
    }
    componentWillMount() {


        firebase.auth().onAuthStateChanged((user) => {
            //console.log("onAuthStateChanged dans consultation")
            //console.log("user=" + JSON.stringify(user))
            if (user) {
                //console.log("you are connected:user " + user.uid)
                firebase.database().ref('Users/' + user.uid + '/Team').once('value', (team) => {
                    //console.log("Team=" + team.val())
                    this.setState({
                        Team: team.val(),
                        user: user
                    }, () => {
                        this.importerTablesurvey(this.state.TousSondages)
                    })
                })


            }
        })


    }

    supprimer_survey(Item) {
        console.log("supprimer" + Item._key);
        // this.state.table_survey = []
        //this.setState({ table_survey: [] })
        firebase.database().ref('Sondage/' + Item._key).remove().then(() => {
            //this.setState({ table_survey: [] })
            this.importerTablesurvey(this.state.TousSondages)
        }).catch((msg) => {
            console.log("Erreur de suppression du sondage " + msg)
        });
    }





    render() {
        if (this.state.user === null)
            return (<LinearProgress />)
        else
            return (
                <div className="App">
                    <NavigationBar history={this.props.history} user={this.state.user} Activelink="Tous les sondages" />
                    <span style={{ color: this.state.TousSondages ? "black" : "gray" }}>Tous les sondages</span>
                    <Switch color="primary" height={20} width={40} onChange={() => {

                        this.setState({ TousSondages: !this.state.TousSondages }, () => {
                            this.importerTablesurvey(this.state.TousSondages)
                        })
                    }}
                        checked={!this.state.TousSondages} />
                    <span style={{ color: this.state.TousSondages ? "gray" : "black" }}>Seulement mes sondages</span>

                    <Box
                        boxShadow={20}
                        style={{
                            margin: 10,
                            padding: 30,
                            alignContent: "center",
                            verticalAlign: "center",
                            backgroundColor: "#1e272e",
                            display: "block",
                            borderRadius: 5

                        }}>

                        <Row style={{ textAlign: "center" }}>
                            {

                                this.state.table_survey !== undefined ?

                                    this.state.table_survey.map((Item, key) => {
                                        return (
                                            <Fade in={true} key={key}
                                            ><Card //className={classes.card} 
                                                style={{
                                                    maxWidth: 345,
                                                    borderRadius: 10,
                                                    margin: 20,
                                                    boxShadow: "3px 4px 2px black",
                                                    backgroundColor: "rgba(209, 204, 192,1.0)"
                                                }}>

                                                    <CardActionArea
                                                        onClick={() => {
                                                            console.log("go to Analyser " + Item._key)
                                                            if (this.state.user.uid === Item.owner_uid)
                                                                this.props.history.push({
                                                                    pathname: "/Analyse/",
                                                                    params: {
                                                                        id_sondage: Item._key,
                                                                        user: this.state.user
                                                                    }
                                                                })
                                                        }}>

                                                        <CardContent>
                                                            <Typography gutterBottom variant="h5" component="h2">
                                                                {Item.Titre}
                                                            </Typography>
                                                            Crée par :{Item.owner}<br />
                                                            Cible :{Item.Statut_sondage}<br />
                                                            Crée le :{Item.date} à {Item.time}
                                                        </CardContent>
                                                    </CardActionArea>

                                                    <CardActions>
                                                        {
                                                            Item.hasAlreadyresponded ?
                                                                <span style={{ color: "#487eb0" }}>Vous avez déja répondu</span>
                                                                :
                                                                <Button size="small" color="primary" //href={`/Afficher_survey/${Item._key}`}
                                                                    onClick={() => {
                                                                        //console.log("Afficher" + Item._key)
                                                                        this.props.history.push({
                                                                            pathname: "/Afficher_survey/",
                                                                            params: {
                                                                                id_sondage: Item._key,
                                                                                user: this.state.user
                                                                            }
                                                                        })
                                                                    }}>
                                                                    Répondre
                                                    </Button>

                                                        }

                                                        {
                                                            Item.owner_uid === this.state.user.uid ?
                                                                <div>
                                                                    <Button size="small" color="primary"// href={`/Creation_survey/${Item._key}`} 
                                                                        onClick={() => {
                                                                            console.log("Modifier")
                                                                            this.props.history.push({
                                                                                pathname: "/Modification_survey/",
                                                                                params: {
                                                                                    id_sondage: Item._key,
                                                                                    user: this.state.user
                                                                                }
                                                                            })
                                                                        }}>
                                                                        Modifier </Button>
                                                                    <Button size="small" color="primary"// href={`/Modification_survey/${key}`} 
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                ItemToDelete: Item,
                                                                                openDialog: true
                                                                            })

                                                                        }}>
                                                                        Supprimer  </Button>

                                                                </div>
                                                                :
                                                                null
                                                        }



                                                    </CardActions>
                                                </Card></Fade>)
                                    })
                                    :
                                    <h1 style={{ color: "black" }}>Loading</h1>

                            }

                            <ConfirmationSuppression
                                numSondage={this.state.ItemToDelete.Titre}
                                openDialog={this.state.openDialog}

                                AnnulerClick={() => {
                                    console.log("Annuler la suppression du sondage " + this.state.ItemToDelete._key)
                                    this.setState({ openDialog: false })
                                }}
                                ConfirmerClick={() => {
                                    console.log("Suppression du sondage " + this.state.ItemToDelete._key)
                                    this.setState({ openDialog: false })
                                    this.supprimer_survey(this.state.ItemToDelete);
                                    this.forceUpdate()
                                }}
                            />
                        </Row>
                    </Box>

                </div>
            );

    }
}

export default Consultation_survey;

