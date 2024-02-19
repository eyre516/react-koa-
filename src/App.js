import "./App.css";
import Header from "./components/Header";
import Body from "./components/Body";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <div className="header-click">
        <Header></Header>
      </div>
      <Body></Body>
      <Footer></Footer>
    </div>
  );
}

export default App;