import { Route } from "@solidjs/router";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Layout>
      <Route path="/" component={HomePage} />
    </Layout>
  );
}