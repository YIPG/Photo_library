import { default as React, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteProps
} from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

const Home = lazy(() => import("../pages/home"));
const Detail = lazy(() => import("../pages/detail"));

export default () => {
  return (
    <Router>
      <Suspense fallback={<CircularProgress />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/:id" component={Detail} />
        </Switch>
      </Suspense>
    </Router>
  );
};
