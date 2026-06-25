import { Route } from "@solidjs/router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import WorkspacePage from "./pages/WorkspacePage";

export default function App() {
  return (
    <Layout>
      <Route path="/" component={HomePage} />
      <Route path="/workspace/:id" component={WorkspacePage} />
    </Layout>
  );
}