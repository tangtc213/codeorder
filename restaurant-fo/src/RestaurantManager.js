import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom'
import OrderManager from './OrderManager'
import FoodManager from './FoodManager'
import DeskManager from './DeskManager'
import AddFood from './AddFood'
import ManagerHeader from  './components/ManagerHeader'


export default function ResaurantManager () {
    return (
        <div>
            <ManagerHeader />
            <main>
                <Switch>
                    <Route path="/manager" exact>
                        <Redirect to="/manager/food" />
                    </Route>
                    <Route path="/manager/order" >
                        <OrderManager />
                    </Route>
                    <Route path="/manager/food" >
                        <FoodManager />
                    </Route>
                    <Route path="/manager/desk" >
                        <DeskManager />
                    </Route>
                    <Route path="/manager/add-food" >
                        <AddFood />
                    </Route>
                </Switch>

            </main>
        </div>
    )
}
