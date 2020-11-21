import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Starter from "./scenes/Starter";
import Keyframes from "./scenes/Keyframes";

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Starter} />
        <Route exact path="/keyframes" component={Keyframes} />
      </Switch>
    </Router>
  );
};
