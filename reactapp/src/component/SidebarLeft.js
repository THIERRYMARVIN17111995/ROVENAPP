import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Dashboard from './Dashboard';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Vente from './Vente';
function SidebarLeft() {
  const navigate=useNavigate();
  const location=useLocation();
    return (
        <div className="sidebar">
        <div className="div_one">
          <div className="cadre">
            <h1>E.S.P</h1>
          </div>
          <ul>
          <li><Link to={'/accueil'}><i class="fa fa-tachometer icon" aria-hidden="true">  </i>Dashboard</Link></li>
          <li><Link to={'/client'}><i class="fa fa-user" aria-hidden="true"></i>Clients</Link></li>
           
            <li><Link to={'/vente'}><i class="fa fa-credit-card" aria-hidden="true"></i>Vente</Link></li>
            <li><Link to={'/utilisateur'}><i class="fa fa-archive" aria-hidden="true"></i>Caisse</Link></li>
            
           
            <li><Link to={'/'}><i class="fa fa-check-circle" aria-hidden="true"></i>Dépense</Link></li>
            <li><Link to={'/fonction'}><i class="fa fa-check-circle" aria-hidden="true"></i>Fonction</Link></li>
            <li><Link to={'/employe'}><i class="fa fa-user" aria-hidden="true"></i>Employés</Link></li>
            <li><Link to={'/utilisateur'}><i class="fa fa-user" aria-hidden="true"></i>Utilisateurs</Link></li>
            <li><Link to={'/'}><i class="fa fa-check-circle" aria-hidden="true"></i>Déconnexion</Link></li>

          </ul>
        </div>
        <div className="div_two">
          <div className="barheader shadow-lg p-3 mb-5 bg-body-tertiary ">
            <div className='container'>
              <div className='row'>
        
            
                <p className='username' >Utilisateur connecté : {sessionStorage.getItem('employe')}</p>
           
              </div>
            </div>
              
          </div>
        
        
         
       {location.pathname==='/accueil' ? <Dashboard /> : ''}
      
        </div>
        </div>
    );
}

export default SidebarLeft;

