import logo from './logo.svg';
import './App.css';
import * as SIP from 'sip.js'

function App() {
  const api = "http://localhost:8000";
  const getAccount = async () => {
    const response = await fetch(`${api}/sip`);
    const { aor, endpoint } = await response.json();
    return { aor, endpoint };
  };
  
  const createUser = async (aor, server) => {
    const user = new SIP.Web.SimpleUser(server, { aor });
    await user.connect();
    await user.register();
    return user;
  };
  
  const runCall = async (aor, name) => {
    const data = { aor, name };
    await fetch(`${api}/call`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };
  
  return (
    <div className="App">
      <button>Connect</button>
    </div>
  );
}

export default App;
