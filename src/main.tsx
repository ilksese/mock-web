import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import WorkspacePage from "./pages/WorkspacePage";
import EndpointEditPage from "./pages/EndpointEditPage";
import "./index.css";

render(
  () => (
    <Router root={Layout}>
      <Route path="/" component={HomePage} />
      <Route path="/workspace/:id" component={WorkspacePage} />
      <Route path="/workspace/:id/endpoint/:eid" component={EndpointEditPage} />
    </Router>
  ),
  document.getElementById("root")!
);