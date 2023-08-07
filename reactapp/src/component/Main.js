import React from 'react';

function Main() {

        const navigate = useNavigate();
        const value_session = sessionStorage.getItem('employe');
        const value_ID = sessionStorage.getItem('ID_Employe');
        console.log(value_session)
        return (
            <div id="wrapper">
                <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
    
    
                    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
                        <div class="sidebar-brand-icon rotate-n-15">
                            <i class="fas fa-laugh-wink"></i>
                        </div>
                        <div class="sidebar-brand-text mx-3">ESP Admin <sup>1</sup></div>
                    </a>
    
    
                    <hr class="sidebar-divider my-0" />
    
                    <li class="nav-item active">
                        <a class="nav-link" href="index.html">
                            <i class="fas fa-fw fa-tachometer-alt"></i>
                            <span>Dashboard</span></a>
                    </li>
    
    
                    <hr class="sidebar-divider" />
    
    
    
    
    
    
    
    
    
                    <hr class="sidebar-divider" />
    
                    <div class="sidebar-heading">
                        Menu
                    </div>
    
                    <li class="nav-item">
                        <Link to={'/client'}>
                            <a class="nav-link" href="charts.html">
                                <i class="fas fa-fw fa-chart-area"></i>
                                <span>Clients</span></a>
                        </Link>
                    </li>
                    <li class="nav-item">
                        <Link to={'/vente'}>
                            <a class="nav-link" href="charts.html">
                                <i class="fas fa-fw fa-chart-area"></i>
                                <span>Vente</span></a>
                        </Link>
                    </li>
                    <li class="nav-item">
                        <Link to={'/depense'}>
                            <a class="nav-link" href="tables.html">
                                <i class="fas fa-fw fa-table"></i>
                                <span>Caisse</span></a>
                        </Link>
                    </li>
                    <li class="nav-item">
                        <Link to={'/depense'}>
                            <a class="nav-link" href="tables.html">
                                <i class="fas fa-fw fa-table"></i>
                                <span>Dépense</span></a>
                        </Link>
                    </li>
    
                    <li class="nav-item">
                        <Link to={'/fonction'}>
                            <a class="nav-link" href="tables.html">
                                <i class="fas fa-fw fa-table"></i>
                                <span>Fonction</span></a>
                        </Link>
                    </li>
                    <li class="nav-item">
                        <Link to={'/employe'}>
                            <a class="nav-link" href="tables.html">
                                <i class="fas fa-fw fa-table"></i>
                                <span>Employés</span></a>
                        </Link>
                    </li>
                    <li class="nav-item">
                        <Link to={'/grille'}>
                            <a class="nav-link" href="tables.html">
                                <i class="fas fa-fw fa-table"></i>
                                <span>grille tarifaire</span></a>
                        </Link>
                    </li>
    
    
    
                    <hr class="sidebar-divider d-none d-md-block" />
    
    
                    <div class="text-center d-none d-md-inline">
                        <button class="rounded-circle border-0" id="sidebarToggle"></button>
                    </div>
    
    
    
    
                </ul>
               
    
            </div>
    );
}

export default Main;