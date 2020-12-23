import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Starter from "./scenes/Starter";
import Keyframes from "./scenes/Keyframes";
import Networked from "./scenes/Networked";

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Starter} />
        <Route exact path="/keyframes" component={Keyframes} />
        <Route exact path="/networked" component={Networked} />
      </Switch>
    </Router>
  );
};
