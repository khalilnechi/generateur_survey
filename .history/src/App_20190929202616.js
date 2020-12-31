import React from 'react';
import './App.css';
import { Button } from 'react-bootstrap';
import NavigationBar from './NavigationBar';
import { Box } from '@material-ui/core';
import TextLoop from "react-text-loop";
import googleplusIcon from './logoOutlook.png';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import logoNewAccess from './logo.png';
import LinearProgress from '@material-ui/core/LinearProgress';



class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height:0,
      loading:true,
      isConnected: true,
      user: ""
    };
  }

  refCallback = element => {
    if (element) {
     // console.log(element.getBoundingClientRect().height);
      this.setState({height:element.getBoundingClientRect().height})
    }
  };
  SIGNINWITHOUTLOOK() {
   // console.log("SIGNINWITHOUTLOOK()")
    var provider = new firebase.auth.OAuthProvider('microsoft.com');

    provider.setCustomParameters({
      client_id:'ff27c526-1ba2-434a-be0b-434eb0349c5f',
    });

    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        // User is signed in.
      //  console.log("result=" + result)
      })
      .catch((error) => {
        // Handle error.
        //console.log("erreur:" + error)
        alert(error)
      });
  }
  componentWillMount() {
    //console.log("this._element.current="+this.refs.divApp)
    firebase.auth().onAuthStateChanged((user) => {
    //  console.log("onAuthStateChanged")
    //  console.log("user=" + JSON.stringify(user))

      if (user) {
        firebase.database().ref('Table_Users').orderByChild("email").equalTo(user.email).once('value', (RegisteredUser) => {
         // console.log("User=" + JSON.stringify(RegisteredUser))
          if (RegisteredUser.exists()) { 
            //alert( Object.values(RegisteredUser.val())[0].email  + " déja existant") 
           // console.log( Object.values(RegisteredUser.val())[0].email ) 

            //console.log("connected")
            this.setState({ isConnected: true })
            this.setState({ user: user })
            //console.log("user=" + user.displayName)
           // console.log("Enregistrement des données du compte dans la base de données ...")
            firebase.database().ref("Users/"+user.uid).update({
              displayName:user.displayName,
              email:user.email,
              Team:Object.values(RegisteredUser.val())[0].Team
            })
          }
          else {
            alert("Vous n'êtes pas prêt à utiliser l'application!! Veuillez contacter l'administrateur afin d'ajouter votre email et votre équipe")
            
          }
        })

        

        
      }
      else
        this.setState({ isConnected: false })


        this.setState({loading:false})
    })
      
    
  }
  render() {

    if(this.state.loading)
    return(

      <LinearProgress />
    )
    else
    return (

      <div ref={this.refCallback} className="App" >

        {
          this.state.isConnected ?
            <NavigationBar history={this.props.history} onClick={() => {
              this.props.history.push({
                pathname: "/Consultation_survey/",
                params: {
                  id_sondage: "-1",
                  user: this.state.user
                }
              })
            }} user={this.state.user} />
            :
            null
        }
        <header
          className="App-header"
          style={{position:this.state.isConnected? "absolute":null,
          height: this.state.isConnected?null:"90vmin",
            bottom:"0px",
            top:"75px",
            left:"0px",
            right:"0px"
          }}
        >
          <img alt="newaccess" src={logoNewAccess} width={300} style={{ marginBottom: 50 }} />
  
          <Box fontWeight="fontWeightLight"
            fontSize={50}
            fontFamily="Courier New"
            letterSpacing={10}
          ><TextLoop children={["Générer", "Envoyer", "Analyser"]} interval={1000} />
            {" votre propre sondage"}</Box>

        </header>
        {
          this.state.isConnected ?
           null
            :
            <Button //variant="outline-info"// href="/Creation_survey" 
              className="btn"
              onClick={this.SIGNINWITHOUTLOOK}>
              <img alt="outlook" src={googleplusIcon} width={40} style={{ marginRight: 20 }} />SE CONNECTER AVEC OUTLOOK</Button>
        }

      </div>
    );

  }
}

export default App;
