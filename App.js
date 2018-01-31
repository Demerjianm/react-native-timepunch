import React, { Component } from 'react';
import {  Container, Header, Content, Button, Footer, Text, Input, Icon, Item, Alert, Label, Form, View } from 'native-base';
import { Font, AppLoading } from "expo";
import { Col, Row, Grid } from 'react-native-easy-grid';
import moment from 'moment'
import { StyleSheet } from 'react-native'
import { API_KEY, USER, PASSWORD, COMPANY, LOGIN_URL, PUNCH_URL } from 'react-native-dotenv'



class App extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
  }
  


  handleChange = (e) => {
    e.preventDefault()
    let { target: { id, value }} = e;
    this.setState({ [id]: value });
  }

  token = () => {
    console.log(this.state.text)
    const empId = this.state.text
    const time = moment().format()
    console.log(time)
    fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Api-Key': API_KEY
      },
      body: JSON.stringify({ 
        credentials: {
        username: USER,
        password: PASSWORD,
        company: COMPANY
        }
      }),
    }).then(function(response) {
      // Shorthand to check for an HTTP 2xx response status.
      // See https://fetch.spec.whatwg.org/#dom-response-ok
      if (response) {
        console.log(response._bodyInit)
        let res = JSON.parse(response._bodyInit)
        const token = res.token
        console.log(token)
        fetch(PUNCH_URL, {
            method: 'POST',
            headers: {
              'Authentication': 'bearer '+ token,
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Api-Key': API_KEY
            },
            body: JSON.stringify({ 
              'punches': [ 
                { 
                  employee: { 
                    employee_id: empId 
                },
                  raw_type: 'PUNCH',
                  timestamp: time,
                  ip: '192.168.111.111' 
                }
              ] 
            }),
          }).then(function(response) {
            // Shorthand to check for an HTTP 2xx response status.
            // See https://fetch.spec.whatwg.org/#dom-response-ok
            if (response) {
              console.log(response)
              alert(
                response._bodyInit,
                { cancelable: false }
              )
            }
            // Raise an exception to reject the promise and trigger the outer .catch() handler.
            // By default, an error response status (4xx, 5xx) does NOT cause the promise to reject!
            throw Error(response.statusText);
        })
      }
      // Raise an exception to reject the promise and trigger the outer .catch() handler.
      // By default, an error response status (4xx, 5xx) does NOT cause the promise to reject!
      throw Error(response.statusText);
    })
  }

  render() {
    return (
      <Container >
        <Header />
        <Content>
          <Form >
          <Item floatingLabel>
            <Label>Employee ID</Label>
            <Input 
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
            />
          </Item>
          </Form>
          <Button bordered large onPress={this.token} style={styles.button}>
            <Text>Clock In </Text>
          </Button>
          <Button bordered danger large onPress={this.punch}>
            <Text>Clock Out </Text>
          </Button>
        </Content>
        <Footer />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
      alignItems: 'center',
  },
  red: {
    color: 'red',
  },
});


export default App
