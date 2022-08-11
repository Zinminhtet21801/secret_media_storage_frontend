import { useState } from "react";
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

function App() {
  return (
    <div className="App">
      <Nav />
      <Switch>
        <Box minH={"86.5vh"}>
          <Route path="/" component={Landing} />
          <Route path="/home" component={Home} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/forgot-password" component={ForgotPasswordForm} />
          <Route path="/contact" component={ContactUs} />
        </Box>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
