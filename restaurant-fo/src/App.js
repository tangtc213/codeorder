import React from 'react';
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import LandingPage from './LandingPage'
import FoodCart from './FoodCart'
import RestaurantManager from './RestaurantManager'
import Login from './Login'
// import HomePage from './HomePage'
import OrderSuccess from './OrderSuccess'
import OrderFinish from './OrderFinish'
import Register from './Register'
import Forget from './Forget'
import Changep from './Changep'
import history from './history'
import './static/style/body.scss'

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>
        <Route path="/landing/r/:rid/d/:did" >
          <LandingPage />
        </Route>
        <Route path="/r/:rid/d/:did/c/:count"  component={FoodCart} />
        <Route path="/r/:rid/d/:did/order-success" component={OrderSuccess} />
        <Route path="/r/:rid/d/:did/order-finish" component={OrderFinish} />
        <Route path="/manager" >
          <RestaurantManager />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/forget">
          <Forget />
        </Route>
        <Route path="/changep/:id">
          <Changep />
        </Route>
      </Switch>
    </Router>

  );
}

export default App;
