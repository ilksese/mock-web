import { Route } from "@solidjs/router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import WorkspacePage from "./pages/WorkspacePage";
import EndpointEditPage from "./pages/EndpointEditPage";

export default function App() {
  return (
    <Route
      path="/"
      component={() => (
        <Layout>
          <Route path="/" component={HomePage} />
          <Route path="/workspace/:id" component={WorkspacePage} />
          <Route path="/workspace/:id/endpoint/:eid" component={EndpointEditPage} />
        </Layout>
      )}
    />
  );
}