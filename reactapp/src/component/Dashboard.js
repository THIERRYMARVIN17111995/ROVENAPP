import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InputNumber } from 'primereact/inputnumber';
import { URL_AXIOS } from '../data/AxiosUrl';
import { ProgressSpinner } from 'primereact/progressspinner';
import Chart from './Chart';
import ChartLoading from './Chart';
function Dashboard() {
  const navigate = useNavigate();
  const value_session = sessionStorage.getItem('employe');
  const value_ID = sessionStorage.getItem('ID_Employe');
  const roleuser = sessionStorage.getItem('Role');
  const [caisse, setCaisse] = useState(0);
  const [depense, setDepense] = useState(0);
  const [depense_caisse, setDepense_caisse] = useState(0);
  const [count_client, setCount_client] = useState(0);
  const [loading, setloading] = useState(true);
  const logout = () => {
    sessionStorage.removeItem("ID_Employe");
    sessionStorage.removeItem("employe");
    navigate('/');
  }
  var nombre = 3500;
  const formate_number = (number) => {
    return (
      <div>{new Intl.NumberFormat().format(nombre)}</div>
    )
  }

  const getTotalVente = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/caisse");
      if (response.data.status === 200) {

        setCaisse(response.data.total);
        console.log("Total :" + response.data.total)

      }
    } catch (Error) {

    }


  }
  const count_client_data = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/client_count");
      if (response.data.status === 200) {

        setCount_client(response.data.count_client);


      }
    } catch (Error) {

    }


  }
  const getTotal_en_caisse = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/difference_caisse_depense");
      if (response.data.status === 200) {

        setDepense_caisse(response.data.total);


      }
    } catch (Error) {

    }


  }
  const getTotalDepense = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/count_depense");
      if (response.data.status === 200) {

        setDepense(response.data.total);


      }
    } catch (Error) {

    }


  }
  useEffect(() => {
    getTotalVente();
    getTotalDepense();
    getTotal_en_caisse();
    count_client_data();
    setTimeout(() => {
      setloading(false)
    }, 1000);
  }, []);
  return (
    <div id="wrapper">
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
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">


            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
              <i class="fa fa-bars"></i>
            </button>
            <ul class="navbar-nav ml-auto">
              <li class="nav-item dropdown no-arrow d-flex">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="mr-2 d-none d-lg-inline text-gray-600 small">{value_session}</span>
                  <img class="img-profile rounded-circle"
                    src="img/undraw_profile.svg" />
                </a>
                <a class="nav-link" href="#" onClick={() => logout()}>
                  <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-red-400"></i>
                  Déconnexion
                </a>
              </li>

            </ul>



          </nav>
          {loading ? <div className='text-center'> <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" /></div> :
            <div className='container-fluid'>
              <div class="content-wrapper">

                <div class="content">
                  <div class="row">
                    <div class="col-xl-3 col-sm-6">
                      <div class="card card-mini mb-4">
                        <div class="card-body bg-success text-light">
                          <h2 class="mb-1">{count_client}</h2>
                          <p>Clients</p>

                        </div>
                      </div>
                    </div>
                    <div class="col-xl-3 col-sm-6">
                      <div class="card card-mini mb-4">
                        <div class="card-body bg-warning text-light">
                          <h2 class="mb-1">{new Intl.NumberFormat().format(caisse)} XAF</h2>
                          <p>Montant vendu</p>

                        </div>
                      </div>
                    </div>
                    <div class="col-xl-3 col-sm-6">
                      <div class="card card-mini  mb-4">
                        <div class="card-body bg-danger text-light">
                          <h2 class="mb-1">{new Intl.NumberFormat().format(depense)} XAF</h2>
                          <p>Dépense</p>

                        </div>
                      </div>
                    </div>
                    <div class="col-xl-3 col-sm-6">
                      <div class="card card-mini mb-4">
                        <div class="card-body bg-info text-light">
                          <h2 class="mb-1">{new Intl.NumberFormat().format(depense_caisse)} XAF</h2>
                          <p>Caisse</p>

                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            </div>

          }

        </div>
        <footer class="sticky-footer bg-white">
          <div class="container my-auto">
            <div class="copyright text-center my-auto">
              <span>Copyright &copy;rovenservicespro-Version 1.0.1</span>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}

export default Dashboard;