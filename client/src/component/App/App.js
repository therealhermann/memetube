import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import  Landing from '../../page/Landing';
import  Result from '../../page/Result';
import  Congrats from '../../page/Congrats';
import  Logo from '../../static/images/logo-light.png';

import './App.css';


function App(props) {
  const history = useHistory();
  
  return (
    <main className="App">
        <Switch>
            <Route path="/" component={Landing} exact />
            <Route path="/result" component={Result} />``
            <Route path="/congrats" component={Congrats} />
        </Switch>
        <a onClick={() => history.push('/')} >
    		<img src={Logo} className="App-home-logo" />
    	</a>

    </main>
  );
}

export default App;
