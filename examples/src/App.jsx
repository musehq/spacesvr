import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Starter from "./scenes/Starter";
import Keyframes from "./scenes/Keyframes";
import Multiplayer from "./scenes/Multiplayer";
import Styled from "./scenes/Styled";
import ManyModels from "./scenes/ManyModels";
import Shop from "./scenes/Shop";

export default () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Starter} />
        <Route exact path="/keyframes" component={Keyframes} />
        <Route exact path="/multiplayer" component={Multiplayer} />
        <Route exact path="/styled" component={Styled} />
        <Route exact path="/models" component={ManyModels} />
        <Route exact path="/shop" component={Shop} />
      </Switch>
    </Router>
  );
};
