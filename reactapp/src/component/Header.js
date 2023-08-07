import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
       
         <div className="div_one">
          <div className="cadre">
            <h1>E.S.P</h1>
          </div>
          <ul>
          <li><Link to={'/accueil'}><i class="fa fa-tachometer icon" aria-hidden="true">  </i>Dashboard</Link></li>
          <li><Link to={'/client'}><i class="fa fa-user" aria-hidden="true"></i>Clients</Link></li>
            <li><Link to={'/employe'}><i class="fa fa-user" aria-hidden="true"></i>Employés</Link></li>
            <li><Link to={'/vente'}><i class="fa fa-credit-card" aria-hidden="true"></i>Vente</Link></li>
            <li><Link to={'/utilisateur'}><i class="fa fa-archive" aria-hidden="true"></i>Caisse</Link></li>
            <Link to={'/utilisateur'}><li><i class="fa fa-user" aria-hidden="true"></i>Utilisateurs</li></Link>
            <li><Link to={'/inventaire'}><i class="fa fa-check-circle" aria-hidden="true"></i>Inventaire</Link></li>
            <li><Link to={'/'}><i class="fa fa-check-circle" aria-hidden="true"></i>Déconnexion</Link></li>
          </ul>
        </div>
    
      
    );
}

export default Header;