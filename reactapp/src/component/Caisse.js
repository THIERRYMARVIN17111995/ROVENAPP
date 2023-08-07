import React, { useEffect, useState } from 'react';
import Main from './Template';
import { Link, useNavigate } from 'react-router-dom';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import axios from 'axios';
import { Button } from 'primereact/button';
import { URL_AXIOS } from '../data/AxiosUrl';
import { ProgressSpinner } from 'primereact/progressspinner';
function Caisse() {
  const roleuser = sessionStorage.getItem('Role');
  const [globalFilter, setGlobalFilter] = useState();
  const [caisse, setCaisse] = useState([]);
  const navigate = useNavigate();
  const value_session = sessionStorage.getItem('employe');
  const ID_Employe_value = sessionStorage.getItem('ID_Employe');
  const [loading, setloading] = useState(true);
  const logout = () => {
    sessionStorage.removeItem("ID_Employe");
    sessionStorage.removeItem("employe");
    navigate('/');
  }

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(caisse);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'Liste des recettes');
    });
  };
  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    });
  };

  const select_data_caisse = async () => {
    const response = await axios.get(URL_AXIOS + "/caisse_suivi");
    if (response.data.status === 200) {

      setCaisse(response.data.caisse);


    }

  }
  const formate_number = (data) => {
    return <p>{new Intl.NumberFormat().format(data.montant)}</p>
  }
  const header = (
    <div className="table-header d-flex">
      <span className="p-input-icon-left mt-0">
        <i className="pi pi-search mt-1" />
        <InputText type="search" className="txt_search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
      </span>

    </div>
  );
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>

        <Button icon="pi pi-eye" className="p-button-rounded p-button-info p-mr-2 " style={{ width: '40px', height: '40px' }} />


      </React.Fragment>
    );
  }
  useEffect(() => {
    select_data_caisse();
    setTimeout(() => {
      setloading(false)
    }, 1000)
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
              <div className=''>
              <Button type='button' label='Exporter' onClick={()=>exportExcel()} icon="pi pi-file-excel"   style={{ height: '37px', width: '130px',marginLeft:10 }} severity="success" />

              </div>
              <br />
              <div class="card shadow mb-5">
                <div class="card-header py-3">
                  <h6 class="m-0 font-weight-bold text-primary " >Liste des recettes</h6>

                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <DataTable value={caisse} paginator rows={10}

                      dataKey="ID_Caisse"
                      selectionMode="single" size='small'

                      header={header} globalFilter={globalFilter}

                      className="p-datatable-customers"
                      emptyMessage="pas de données." >

                      <Column field="ID_Caisse" header="#" />
                      <Column field="montant" header="Montant" body={formate_number} />
                      <Column field="created_at" header="Date" />
                      <Column field="nom" header="Opérateur" />
                   
                    </DataTable>

                  </div>
                </div>
              </div>

            </div>
          }
        </div>
        <footer class="sticky-footer bg-white">
          <div class="container my-auto">
            <div class="copyright text-center my-auto">
              <span>Copyright &copy;Version 1.0.1</span>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}

export default Caisse;