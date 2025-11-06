import appStyles from './App.module.css'

import MainCard from './components/MainCard/MainCard';
import NavigationCard from './components/NavigationCard/NavigationCard';

function App() {
  return (
    <div className={appStyles.app}>
      <NavigationCard/>
      <MainCard/>
    </div>
  );
}

export default App;
