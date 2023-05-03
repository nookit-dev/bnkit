// import { useFetcher } from "@instant-bun/react-fetcher";

import { Slider } from "@instant-bun/react-ui";
import "./App.css";
import logo from "./logo.svg";

function App() {
  // const {} = useFetcher();
  return (
    <div className="App" role="main">
      <article className="App-article">
        <img src={logo} className="App-logo" alt="logo" />
        <Slider
          onChange={(value) => console.log(value)}
          id="slider"
          max={100}
          min={1}
          value={10}
        />
        <h3>Welcome to React!</h3>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React Test TEst
        </a>
      </article>
    </div>
  );
}

export default App;
