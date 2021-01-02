import { useEffect } from "react";
import { Provider } from "react-redux";
import { Logo } from "./components";
import { AxiosProvider } from "./providers/axios";
import store from "./redux/store";
import { ActionTypes } from "./redux/reducers/step-reducer/step-reducer";
import "./App.css";
import Router from "./routes";

function App() {
  useEffect(() => {
    store.dispatch({ type: ActionTypes.HYDRATE });
  });
  return (
    <Provider store={store}>
      <AxiosProvider>
        <main className='layout'>
          <Logo />
          <Router />
        </main>
      </AxiosProvider>
    </Provider>
  );
}

export default App;
