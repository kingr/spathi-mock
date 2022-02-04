import { useEffect } from "react";
import auth0 from "auth0-js";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

const config = {
  domain: "lifecheq-dev.auth0.com",
  clientId: "u6TF43p47DO5u33ZqK4ETloRU1d5UMN3",
  audience: "https://utwig-staging.herokuapp.com",
  realm: "Username-Password-Authentication",
}

const webAuth = new auth0.WebAuth({
  domain: config.domain,
  clientID: config.clientId,
  redirectUri: `${window.location.origin}/login`,
  audience: config.audience,
  responseType: "token"
});

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">login</Link>
            </li>
            <li>
              <Link to="/dashboard">dashboard</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}


function Home() {
  useEffect(() => {
    webAuth.authorize({prompt: "none", responseType: "token" })
  },[])
  
  return (
    <>
      <h2>Home</h2>;
    </>
  )
}

function Login() {
  let navigate = useNavigate();
  useEffect(() => {
    setInterval(() => {
      webAuth.checkSession({prompt: "none", responseType: "token" }, res => {
        if (res === null) navigate("/dashboard")
      });
    }, 5000)
  },[navigate])
  return (
      <>
        <h2>Login</h2>
        <button onClick={() => {
          webAuth.checkSession({prompt: "none", usePostMessage: true }, res => {
            if (res === null) {
              navigate("/dashboard")
            } else {
              console.log(res)
            }
          });
        }}>Check Session</button>
        <button onClick={() => {
          webAuth.authorize({
            connection: "google-oauth2",
            responseType: "token",
          });
        }}>Google</button>
      </>
    )
}

function Dashboard() {
  let navigate = useNavigate();
  useEffect(() => {
    setInterval(() => {
      webAuth.checkSession({prompt: "none", responseType: "token" }, res => {
        if (res) navigate("/login")
      });
    }, 5000)
  },[navigate])
  return (
  <>
      <button onClick={() => {
            webAuth.logout({});
          }}>Logout</button>
          
      <a href="http://localhost:5000/your-plan/overview" rel="noreferrer"  target="_blank">go to hunam</a>
    </>
    );
}

export default App;
