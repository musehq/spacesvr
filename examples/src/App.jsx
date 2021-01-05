import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Starter from "./scenes/Starter";
import Keyframes from "./scenes/Keyframes";
import Multiplayer from "./scenes/Multiplayer";

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Starter} />
        <Route exact path="/keyframes" component={Keyframes} />
        <Route exact path="/multiplayer" component={Multiplayer} />
      </Switch>
    </Router>
  );
};
