import cardStyles from '../../styles/cardStyles.module.css'
import mainStyles from './mainCard.module.css'

import AboutUsSection from './AboutUsSection/AboutUsSection'

import {Routes,Route} from 'react-router-dom';

export default function MainCard(){
  return(
    <div className={`${cardStyles.card} ${mainStyles.mainCard}`}>
      <Routes>
        <Route path={'/about'} element={<AboutUsSection/>}/>
      </Routes>
    </div>
  )
}