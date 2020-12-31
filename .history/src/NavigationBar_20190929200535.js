import { Button, Navbar, Nav, Modal } from 'react-bootstrap';
import React from 'react';
import logoNewAccess from './logo.png';
import * as firebase from 'firebase/app';
import Avatar from '@material-ui/core/Avatar';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Badge, TextField, Fade, Chip } from '@material-ui/core/';
import SondagesIcon from '@material-ui/icons/Assignment';
import AddPerson from '@material-ui/icons/Person';

class NavigationBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      admin: false,
      show: false,
      email: "",
      TeamChecked: "APSYS",
      Users_registered: []
    }
    this.AddUser = this.AddUser.bind(this)
  }
  signout() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      //console.log("deconnecté")

    }).catch(function (error) {
      // An error happened.
      // console.log("erreur=" + error)
    });
  }
  AddUser() {

    firebase.database().ref('Table_Users').orderByChild("email").equalTo(this.state.email).once('value', (user) => {
      //Tester l'existance de l'utilisateur
      if (user.exists()) { alert(this.state.email + " déja existant") }
      else {
        var newID = firebase.database().ref("Table_Users").push().key;
        firebase.database().ref("Table_Users/" + newID).set({
          Team: this.state.TeamChecked,
          email: this.state.email
        }).then(() => {
          this.forceUpdate()
          // this.setState({ show: false })
        })
      }
    })

  }
  DeleteUser(userkey) {
    firebase.database().ref('Table_Users/' + userkey).remove().then(() => {
      this.forceUpdate()
    })
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref("Admin_Mails").on('value', (mails) => {
          if (mails.val().includes("user.email")) {
            this.setState({ admin: true })
            firebase.database().ref('Table_Users').on('value', (Users_registered) => {
              this.state.Users_registered = [Users_registered.val()]
              Users_registered.forEach((User_registered) => {
                this.state.Users_registered.push({
                  key: User_registered.key,
                  Team: User_registered.val().Team,
                  email: User_registered.val().email,
                })
              })
            })
          }
          else
            this.setState({ admin: false })
        })
      }

    })




  }
  render() {

    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/"><img src={logoNewAccess} className="Logo" alt="logo" /></Navbar.Brand>
        <Nav className="mr-auto">

          <Nav.Link onClick={() => {
            this.props.history.push({
              pathname: "/Creation_survey/",
              params: {
                id_sondage: "-1",
                user: this.props.user
              }
            })
          }}
            style={{ color: this.props.Activelink === "Créer un sondage" ? "white" : null }}>Créer un sondage</Nav.Link>

          <Nav.Link onClick={
            () => {
              this.props.history.push({
                pathname: "/Consultation_survey/",
                params: {
                  user: this.props.user
                }
              })
            }}
            style={{
              color: this.props.Activelink === "Tous les sondages" ? "white" : null
            }}>
            <Badge color="secondary" variant="dot" invisible={false} >
              <SondagesIcon />
            </Badge>
          </Nav.Link>

          {
            this.state.admin ?
              <Nav.Link onClick={
                () => {
                  //console.log("Add user in Table_Users")
                  this.setState({ show: true })
                }}
                style={{
                  color: this.props.Activelink === "Tous les sondages" ? "white" : null
                }}>
                <Badge color="secondary" variant="dot" invisible={true} >
                  <AddPerson />
                </Badge>
              </Nav.Link>
              :
              null
          }

        </Nav>

        {
          this.props.user ?

            <Nav > <Navbar.Brand href="/"><Avatar style={{
              marginTop: 5,
              color: '#fff',
              backgroundColor: "#e67e22",
            }}>{this.props.user.displayName[0]}</Avatar></Navbar.Brand>
              <Nav.Link style={{ color: "white", padding: 0, marginRight: 10, marginTop: 15 }}>{this.props.user.displayName}</Nav.Link>
              <Button variant="outline-info" href="/" onClick={this.signout}>Déconnexion</Button></Nav>
            : null

        }




        <Modal
          show={this.state.show}
          onHide={() => {
            // console.log("hide")

            this.setState({ show: false })
          }}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"

        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Ajouter un utilisateur à votre équipe
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ paddingLeft: 100 }}>
            <TextField
              id="outlined-with-placeholder"
              label="Email de l'utilisateur"
              placeholder="xyz@newaccess.ch"
              //className="TextField_Creation_survey"
              style={{ width: 300 }}
              margin="normal"
              variant="outlined"
              value={this.state.email}
              onChange={(e) => { this.setState({ email: e.currentTarget.value }); }}
            />


            <FormControl variant="filled" //className={classes.formControl}
            >
              <InputLabel htmlFor="filled-age-native-simple">Team</InputLabel>
              <Select
                native
                value={this.state.TeamChecked}
                onChange={(event) => {
                  this.setState({ TeamChecked: event.target.value })
                }}
                input={<FilledInput name="age" id="filled-age-native-simple" />}
              >
                <option value="APSYS">APSYS</option>
                <option value="CIM">CIM</option>
                <option value="QA">QA</option>
                <option value="Autres">Autres</option>
              </Select>
            </FormControl>

            {
              this.state.Users_registered.map((el, key) => {
                // console.log(el.key)
                if (el.key)
                  return (
                    <Fade key={key} in={true}>
                      <div>
                        <br />
                        <Chip
                          label={"Email: " + el.email + " Team: " + el.Team}
                          onDelete={() => {//console.log("delete "+el.key);
                            this.DeleteUser(el.key)
                          }}
                          //className={classes.chip}
                          key={el.key}
                          color="primary"
                          variant="outlined"
                        />
                      </div>
                    </Fade>
                  )
              })
            }

            <footer id="footer" style={{ marginTop: 20 }}>
              <Button variant="outline-info" style={{ borderRadius: 30, margin: 10 }} //href="/Consultation_survey"
                onClick={this.AddUser}>Ajouter</Button>
            </footer>

          </Modal.Body>
        </Modal>
      </Navbar>
    )
  }
};
export default NavigationBar;