import "./App.css";
import Nav from "./components/NavBar";
import Footer from "./components/Footer";
import { Route, Switch } from "wouter";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPasswordForm from "./pages/ForgotPassword";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import { Box } from "@chakra-ui/react";
import TechStack from "./pages/TechStack";
import WithAuth from "./components/WithAuth";

function App() {
  return (
    <div className="App">
      <Nav />
      <Box>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/home/:rest*">
            <WithAuth>
              <Home />
            </WithAuth>
          </Route>

          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/forgot-password" component={ForgotPasswordForm} />
          <Route path="/contact" component={ContactUs} />
          <Route path="/techStack" component={TechStack} />
        </Switch>
      </Box>
      <Footer />
    </div>
  );
}

export default App;
