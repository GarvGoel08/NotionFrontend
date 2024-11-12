import logo from "./logo.svg";
import "./App.css";
import TextEditor from "./textEditor";

function App() {
  return (
    <div className="Main">
      <div className="sideBar"></div>
      <div className="MainEditor">
        <h1 className="Logo">Notion</h1>
        <p className="Intro">
          Helloo{" "}
          <span role="img" aria-label="greetings" className="Emoji">
            👋
          </span>{" "}
          Type <span className="Code">/</span> to see available elements.
        </p>
        <TextEditor />
      </div>
    </div>
  );
}

export default App;
