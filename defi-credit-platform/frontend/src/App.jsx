import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoanApplication from './pages/LoanApplication';
import AIInterview from './pages/AIInterview';
import CreditReport from './pages/CreditReport';
import StakeLoan from './pages/StakeLoan';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  // ...existing state...

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<LoanApplication />} />
          <Route path="/ai-interview" element={<AIInterview />} />
          <Route path="/report" element={<CreditReport />} />
          <Route path="/stake" element={<StakeLoan />} />
          <Route path="/group-lending" element={
            <GroupLending 
              onStepComplete={(step) => console.log(`Completed step ${step}`)} 
            />
          } />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;