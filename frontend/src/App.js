import appStyles from './App.module.css'
import AuthCard from './components/AuthCard/AuthCard';

function App() {
  return (
    <div className={appStyles.app}>
      <AuthCard/>
    </div>
  );
}

export default App;
