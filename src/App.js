import { useEffect } from "react";
import { Provider } from "react-redux";
import { AxiosProvider } from "./providers/axios";
import store from "./redux/store";
import { ActionTypes } from "./redux/reducers/step-reducer";
import "./App.css";
import Router from "./routes";

function App() {
  useEffect(() => {
    store.dispatch({ type: ActionTypes.HYDRATE });
  });
  return (
    <Provider store={store}>
      <AxiosProvider>
        <Router />
      </AxiosProvider>
    </Provider>
  );
}

export default App;
