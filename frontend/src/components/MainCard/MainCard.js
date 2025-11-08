import cardStyles from '../../styles/cardStyles.module.css'
import mainStyles from './MainCard.module.css'

import AboutUsSection from './AboutUsSection/AboutUsSection'
import LoginSection from './LoginSection/LoginSection'
import RegisterSection from './RegisterSection/RegisterSection'

import {Routes,Route} from 'react-router-dom';

export default function MainCard(){
  return(
    <div className={`${cardStyles.card} ${mainStyles.mainCard}`}>
      <Routes>
        <Route path={'/about'} element={<AboutUsSection/>}/>
        <Route path={'/login'} element={<LoginSection/>}/>
        <Route path={'/register'} element={<RegisterSection/>}/>
      </Routes>
    </div>
  )
}