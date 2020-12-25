import { Provider } from "react-redux";
import store from "./redux/store";
import logo from "./logo.svg";
import "./App.css";
import Router from "./routes";

function App() {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  );
}

export default App;
