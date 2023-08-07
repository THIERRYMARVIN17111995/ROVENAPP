import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ToastContainer, toast } from 'react-toastify';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { URL_AXIOS } from '../data/AxiosUrl';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
function HistoriqueClient() {

  const navigate = useNavigate();
  const { id } = useParams();

  const value_session = sessionStorage.getItem('employe');
  const ID_Employe_value = sessionStorage.getItem('ID_Employe');
  const roleuser = sessionStorage.getItem('Role');
  const [visible, setVisible] = useState(false);
  const [visiblem, setVisiblem] = useState(false);
  const [vente, setVente] = useState([]);
  const [client, setClient] = useState([]);
  const [client_load, setClient_load] = useState([]);
  const [nomclient, setNomclient] = useState("");
  const [telephoneclient, setTelephoneclient] = useState("");
  const [ID_Client, setID_Client] = useState("");
  const [actions, setActions] = useState("");
  const [montant, setMontant] = useState(0);
  const [avance, setAvance] = useState(1);
  const [reste, setReste] = useState(0);
  const [valuemont, setValuemont] = useState(0);
  const [observation, setObservation] = useState("");
  const [tarif, setTarif] = useState([]);
  const [tarifload, setTarifload] = useState([]);
  const [total, setTotal] = useState(0);
  const [arra, setArra] = useState([]);
  const [ID_Vente, setID_Vente] = useState(0);
  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState();
  const [visiblemo, setVisiblemo] = useState(false);
  const [visibleConfi, setVisibleConfi] = useState(false);
  const [visibleModif, setVisibleModif] = useState(false);
  const [selectedVente, setSelectedVente] = useState([]);
  const [selectedDropdownVente, setSelectedDropdownVente] = useState(null);
  const [selectedDropdownTarif, setSelectedDropdownTarif] = useState(null);
  const [loading, setloading] = useState(true);
  const [visible_dialog, setVisible_dialog] = useState(false);
  const [date, setDate] = useState(null);
  const notify = () => toast("Wow so easy!");
  const logout = () => {
    sessionStorage.removeItem("ID_Employe");
    sessionStorage.removeItem("employe");
    navigate('/');
  }

  const getTotalVente = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/totalVendu");
      if (response.data.status === 200) {

        setTotal(response.data.total);


      }
    } catch (Error) {

    }


  }








  //console.log("Montant "+select_data_grille_by_id(valuemont))

  const showSuccess = () => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: "L'enregistrement a été effectué avec succès !", life: 3000 });
  }

  const showInfo = () => {
    toast.current.show({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
  }

  const showWarn = () => {
    toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Message Content', life: 3000 });
  }

  const showError = (message) => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: message, life: 3000 });
  }



  const select_data_vente = async () => {
    try {
      const response = await axios.get(URL_AXIOS + `/client_historique/${id}`);
      if (response.data.status === 200) {

        setVente(response.data.vente);

      }
    } catch (Error) {

    }


  }
  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">

          <div>{selectedDropdownVente !== null ? option.nomclient : 'Marvin'}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option) => {
    return (
      <div className="flex align-items-center">

        <div>{option.nomclient}</div>
      </div>
    );
  };

  const selectedCountryTemplate_tarif = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">

          <div>{option.libelletarif}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate_tarif = (option) => {
    return (
      <div className="flex align-items-center">

        <div>{option.libelletarif}</div>
      </div>
    );
  };
  const mettre_a_jour = () => {
    sessionStorage.setItem("dateexport", selectedVente.created_at);
    navigate(`/updatevente/${selectedVente.ID_Vente}`);
  }
  const actionBodyTemplate = () => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-mr-2 " style={{ width: '40px', height: '40px' }} onClick={() => mettre_a_jour()} disabled={roleuser === "A" ? false : true} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger ml-2 b_edit_sup" style={{ width: '40px', height: '40px' }} onClick={() => setVisiblemo(true)} disabled={roleuser === "A" ? false : true} />
      </React.Fragment>
    );
  }

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(vente);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'Liste des opérations');
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


  const header = (
    <div className="table-header d-flex">
      <span className="p-input-icon-left mt-0">
        <i className="pi pi-search mt-1" />
        <InputText type="search" className="txt_search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
      </span>
      <h6 class=" font-weight-bold text-primary ml-5"></h6>
    </div>
  );

  useEffect(() => {

    select_data_vente();
    setTimeout(() => {
      setloading(false)
    }, 1000)
    if (ID_Employe_value === null) {
      navigate('/')
    }

  }, []);
  const formate_number = (data) => {
    return <p>{new Intl.NumberFormat().format(data.montant)}</p>
  }
  const formate_number_total = (data) => {
    return <p>{new Intl.NumberFormat().format(data.reste)}</p>
  }
  return (
    <div id="wrapper">
      <Toast ref={toast} />




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
                    src="../img/undraw_profile.svg" />
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
              <div className='row'>
                <div className='col col-md-11'>

                </div>
                <div className='col col-md-1'>
                <button type='button' onClick={()=>navigate('/client')} style={{float:'right',marginLeft:10}} className='text-light btn btn-warning'>Retour</button>
                <Button type='button' label='Exporter' onClick={()=>exportExcel()} icon="pi pi-file-excel"   style={{ height: '37px', width: '130px',float:'right',marginLeft:10 }} severity="success" />
               
                </div>
              </div>
              <br />
              <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex">
                  <h6 class="m-0 font-weight-bold text-primary">Mouvements client</h6>

                </div>
                <div class="card-body">

                  <DataTable value={vente} paginator rows={10}
                    dataKey="ID_Vente"
                    selectionMode="single" size='small'
                    selection={selectedVente} onSelectionChange={(e) => setSelectedVente(e.value)}

                    header={header} globalFilter={globalFilter}
                    className="p-datatable-customers"
                    emptyMessage="pas de données." >
                    <Column field="ID_Vente" header="#" className='text-center' />
                    <Column field="actions" header="N° Facture" />
                    <Column field="nomclient" header="Client" />
                    <Column field="type_client" header="Type client" />
                    <Column field="libelletarif" header="Libellé" />
                    <Column field="montant" header="Prix unitaire" className='text-center' body={formate_number} />
                    <Column field="quantite" header="quantité" className='text-center' />
                    <Column field="reste" header="Prix total" className='text-center' body={formate_number_total} />
                    <Column field="created_at" header="Date" className='text-center' />
                    <Column field="nom" header="Opérateur" />
                  </DataTable>

                </div>
              </div>

            </div>
          }
        </div>
        <footer class="sticky-footer bg-white">
          <div class="container my-auto">
            <div class="copyright text-center my-auto">
              <span>Copyright &copy;rovenservicespro-V.0.0.1</span>
            </div>
          </div>
        </footer>
      </div>

    </div>
  );
}

export default HistoriqueClient;