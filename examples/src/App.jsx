import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Starter from "./scenes/Starter";
import Keyframes from "./scenes/Keyframes";
import Styled from "./scenes/Styled";
import ManyModels from "./scenes/ManyModels";

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Starter} />
        <Route exact path="/keyframes" component={Keyframes} />
        <Route exact path="/styled" component={Styled} />
        <Route exact path="/models" component={ManyModels} />
      </Switch>
    </Router>
  );
};
