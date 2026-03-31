import NammaRideAuth from "./components/pages/Auth/NammaRideAuth";
import SignIn from "./NammaRideAuth";
import SignUp from "./NammaRideAuth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;