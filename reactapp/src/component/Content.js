import React from 'react';
import PropTypes from 'prop-types';

function Content() {
    return (
        <div className="div_two">
        <div className="barheader shadow-lg p-3 mb-5 bg-body-tertiary ">
            <p>Utilisateur connecté : {sessionStorage.getItem('employe')}</p>
        </div>
      
      
  
    
      </div>
    );
}

export default Content;