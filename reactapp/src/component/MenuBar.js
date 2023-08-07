import React from 'react';
import { Link } from 'react-router-dom';

function MenuBar() {
    const value_session = sessionStorage.getItem('employe');
    const ID_Employe_value = sessionStorage.getItem('ID_Employe');
    const roleuser = sessionStorage.getItem('Role');
    return (
        <div>
            <ul class="navbar-nav  sidebar sidebar-dark accordion" id="accordionSidebar" style={{ backgroundColor: '#3b281a' }}>


                <a class="sidebar-brand d-flex align-items-center justify-content-center" href="#">
                    <div class="sidebar-brand-icon rotate-n-15">

                    </div>
                    <div class="sidebar-brand-text mx-3">ROVEN SERVICES PRO <sup></sup></div>
                </a>


                <hr class="sidebar-divider my-0" />

                <li class="nav-item active">
                    <Link class="nav-link" to={'/accueil'}>
                        <i class="fas fa-fw fa-tachometer-alt"></i>
                        <span>Dashboard</span></Link>
                </li>

                <hr class="sidebar-divider" />

                <div class="sidebar-heading">
                    Menu
                </div>

                <li class="nav-item">
                    <Link to={'/client'} class="nav-link">

                        <i class="pi pi-users"></i>
                        <span>Clients</span>
                    </Link>
                </li>
                <li class="nav-item">
                    <Link to={'/vente'} class="nav-link">

                        <i class="pi pi-shopping-bag"></i>
                        <span>Vente</span>
                    </Link>
                </li>

                <li class="nav-item">
                    <Link to={'/facturation'} class="nav-link">

                        <i class="pi pi-file"></i>
                        <span>Facture</span>
                    </Link>
                </li>
                <li class="nav-item">
                    <Link to={'/caisse'} class="nav-link">

                        <i class="pi pi-briefcase"></i>
                        <span>Caisse</span>
                    </Link>
                </li>
                <li class="nav-item">
                    <Link to={'/depense'} class="nav-link">

                        <i class="pi pi-send"></i>
                        <span>Dépense</span>
                    </Link>
                </li>
                {
                    roleuser === "A" ? <li class="nav-item">
                        <Link to={'/fonction'} class="nav-link">

                            <i class="pi pi-bookmark"></i>
                            <span>Fonction</span>
                        </Link>
                    </li> : ''
                }
                {
                    roleuser === "A" ?
                        <li class="nav-item">
                            <Link to={'/employe'} class="nav-link">

                                <i class="pi pi-users"></i>
                                <span>Employés</span>
                            </Link>
                        </li> : ''
                }

                <li class="nav-item">
                    <Link to={'/grille'} class="nav-link">

                        <i class="pi pi-list"></i>
                        <span>grille tarifaire</span>
                    </Link>
                </li>
                <li class="nav-item">
                    <Link to={'/statistique'} class="nav-link">

                        <i class="pi pi-calendar-plus"></i>
                        <span>Statistiques</span>
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default MenuBar;