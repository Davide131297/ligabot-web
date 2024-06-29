import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';


const LigaSeite = ({ligaName}) => { 
    const [logo, setLogo] = useState(null);  

    return (
        <div>
            <h1>LigaSeite</h1>
        </div>
    );
}
export default LigaSeite;