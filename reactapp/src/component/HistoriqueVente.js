import axios from 'axios';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ToastContainer, toast } from 'react-toastify';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Checkbox } from "primereact/checkbox";
import { URL_AXIOS } from '../data/AxiosUrl';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Tag } from 'primereact/tag';


function Historique() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const value_session = sessionStorage.getItem('employe');
  const ID_Employe_value = sessionStorage.getItem('ID_Employe');
  const [visible, setVisible] = useState(false);
  const [visiblem, setVisiblem] = useState(false);
  const [vente, setVente] = useState([]);
  const [client, setClient] = useState([]);
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
  const [total, setTotal] = useState(0);
  const [arra, setArra] = useState([]);
  const [loading, setloading] = useState(true);
  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState();
  const [visiblemo, setVisiblemo] = useState(false);
  const [visibleConfi, setVisibleConfi] = useState(false);
  const [visibleModif, setVisibleModif] = useState(false);
  const [selectedVente, setSelectedVente] = useState([]);
  const [visibleConfirme, setVisibleConfirme] = useState(false);
  const dt = useRef(null);

  const exportColumns = vente.map((col) => ({ title: col.header, dataKey: col.field }));
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(vente);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'historique ventes');
    });
  }; const saveAsExcelFile = (buffer, fileName) => {
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
  const header_export = (
    <div className="flex align-items-center justify-content-end gap-2">

      <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />

    </div>
  );
  const logout = () => {
    sessionStorage.removeItem("ID_Employe");
    sessionStorage.removeItem("employe");
    navigate('/');
  }


  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  }

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }
  const notify = () => toast("Wow so easy!");
  const getTotalVente = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/totalVendu");
      if (response.data.status === 200) {

        setTotal(response.data.total);


      }
    } catch (Error) {

    }


  }
  const update_state_vente_histo = async (id) => {
    try {
      if (selectedVente.status_vente_fact === "F") {
        const response = await axios.post(URL_AXIOS + `/vente_fermer_late/${id}`, {
          ID_Employe: ID_Employe_value,
          created_at: selectedVente.created_at
        });
        if (response.data.status === 200) {
          select_data_vente();
          setVisiblem(false)


        }
      } else {
        showWarn();
      }
    } catch (Error) {

    }


  }
  const confirm1 = () => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept,
      reject
    });
  };
  const select_data_liste_grille = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/liste_tarif");
      if (response.data.status === 200) {

        setTarif(response.data.tarif);


      }
    } catch (Error) {

    }


  }

  const closeSell = async (id) => {
    try {
      const response = await axios.post(URL_AXIOS + `/fermervente/${id}`);
      if (response.data.status === 200) {

        console.log(response.data.message);
        showSuccess()
        select_data_vente();
        setVisiblem(false)

      }
    } catch (Error) {

    }


  }
  const select_data_grille_by_id = async (id) => {
    try {
      const response = await axios.get(URL_AXIOS + `/get_id_tarif/${id}`);
      if (response.data.status === 200) {

        setMontant(response.data.tarif.montant);


      }
    } catch (Error) {

    }


  }

  const showSuccess = () => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: "L'enregistrement a été effectué avec succès !", life: 3000 });
  }

  const showInfo = () => {
    toast.current.show({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
  }

  const showWarn = () => {
    toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Message Content', life: 3000 });
  }

  const showError = () => {
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 3000 });
  }






  const select_data_vente = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/vente_history");
      if (response.data.status === 200) {

        setVente(response.data.vente);
      }
    } catch (Error) {

    }


  }
  const actionBodyTemplate = () => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2 " style={{ width: '40px', height: '40px' }} onclick={() => setVisibleModif(true)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning ml-2 b_edit_sup" style={{ width: '40px', height: '40px' }} onClick={() => setVisiblemo(true)} />
      </React.Fragment>
    );
  }
  const actionCheck = (rowData) => {
    return (
      <React.Fragment>

        <Checkbox onChange={e => setChecked(rowData.status_vente === 1 ? true : false)} checked={checked}></Checkbox>
      </React.Fragment>
    );
  }
  const renderFooter = () => {
    return (
      <div>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setVisiblem(false)} />
        <Button label="Yes" icon="pi pi-check" autoFocus onClick={() => update_state_vente_histo(selectedVente.ID_Client)} />
      </div>
    );
  }


  const header = (
    <div className="table-header flex align-items-center  gap-2">
      <span className="p-input-icon-left mt-0">
        <i className="pi pi-search mt-1" />
        <InputText type="search" className="txt_search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
        <Button type="button" icon="pi pi-file-excel" className='ml-2 ' style={{ height: '40px', width: '40px' }} severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
      </span>

    </div>
  );
  const visualize_before_print = () => {

    if (selectedVente.ID_Client === 0) {
      showError("Veuillez sélectionner la ligne ")
    } else if (selectedVente.ID_Client !== 0) {
      navigate(`/facture/${selectedVente.ID_Client}`)
    }
    sessionStorage.setItem("status_retour", "H");
    sessionStorage.setItem("m", selectedVente.created_at);
    sessionStorage.setItem("status", selectedVente.status_vente_fact);
  }
  const formate_number = (data) => {
    return <p>{new Intl.NumberFormat().format(data.montant)}</p>
  }
  const formate_number_total = (data) => {
    return <p>{new Intl.NumberFormat().format(data.reste)}</p>
  }
  /* const statusBodyTemplate = (product) => {
     return <Tag value={product.state_vente} severity={state_vente(product)}></Tag>;
 };*/
  /*const state_vente=(data)=>{
  
    switch (parseInt(data.state_vente)) {
      case 1:
          return 'success';

      case 0:
          return 'warning';
   
  }
  }*/
  useEffect(() => {
    select_data_vente();
    getTotalVente();
    setTimeout(() => {
      setloading(false)
    }, 1000)
    if (ID_Employe_value === null) {
      navigate('/')
    }

  }, []);

  return (
    <div id="wrapper">
      <Toast ref={toast} />


      <Dialog header="Confirmation" visible={visiblem} modal style={{ width: '350px' }} footer={renderFooter('visiblem')} onHide={() => setVisiblem(false)}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          <span className='ml-2'>Voulez fermer la vente ?</span>
        </div>
      </Dialog>
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









        <hr class="sidebar-divider" />

        <div class="sidebar-heading">
          Menu
        </div>

        <li class="nav-item">
          <Link to={'/client'} class="nav-link">

            <i class="fas fa-fw fa-chart-area"></i>
            <span>Clients</span>
          </Link>
        </li>
        <li class="nav-item">
          <Link to={'/vente'} class="nav-link">

            <i class="fas fa-fw fa-chart-area"></i>
            <span>Vente</span>
          </Link>
        </li>
        <li class="nav-item">
          <Link to={'/facturation'} class="nav-link">

            <i class="fas fa-fw fa-table"></i>
            <span>Facture</span>
          </Link>
        </li>
        <li class="nav-item">
          <Link to={'/caisse'} class="nav-link">

            <i class="fas fa-fw fa-table"></i>
            <span>Caisse</span>
          </Link>
        </li>
        <li class="nav-item">
          <Link to={'/depense'} class="nav-link">

            <i class="fas fa-fw fa-table"></i>
            <span>Dépense</span>
          </Link>
        </li>

        <li class="nav-item">
          <Link to={'/fonction'} class="nav-link">

            <i class="fas fa-fw fa-table"></i>
            <span>Fonction</span>
          </Link>
        </li>
        <li class="nav-item">
          <Link to={'/employe'} class="nav-link">

            <i class="fas fa-fw fa-table"></i>
            <span>Employés</span>
          </Link>
        </li>
        <li class="nav-item">
          <Link to={'/grille'} class="nav-link">

            <i class="fas fa-fw fa-table"></i>
            <span>grille tarifaire</span>
          </Link>
        </li>
        <li class="nav-item">
          <Link to={'/statistique'} class="nav-link">

            <i class="fas fa-fw fa-table"></i>
            <span>Statistiques</span>
          </Link>
        </li>


        <hr class="sidebar-divider d-none d-md-block" />


        <div class="text-center d-none d-md-inline">
          <button class="rounded-circle border-0 bg-danger" id="sidebarToggle20" onClick={() => logout()}><i class="fa-solid fa-right-from-bracket text-light"></i></button>
        </div>




      </ul>
      <div id="content-wrapper" class="d-flex flex-column">
        <div id="content">
          <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">


            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
              <i class="fa fa-bars"></i>
            </button>



            <ul class="navbar-nav ml-auto">
              <li class="nav-item dropdown no-arrow">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span class="mr-2 d-none d-lg-inline text-gray-600 small">{value_session}</span>
                  <img class="img-profile rounded-circle"
                    src="img/undraw_profile.svg" />
                </a>

                <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                  aria-labelledby="userDropdown">




                  <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Déconnexion
                  </a>
                </div>
              </li>

            </ul>

          </nav>
          <Toast ref={toast} />
          <ConfirmDialog />

          {loading ? <div className='text-center'> <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" /></div> :
            <div className='container-fluid'>
              <div className='row'>

                <div className='container-fluid'>

                  <button type='button' onClick={() => visualize_before_print()} className='btn btn-primary text-light' >Imprimer facture</button>
                  <button type='button' className='btn btn-info ml-1 text-light' >Imprimer la liste</button>
                  <button type='button' className='btn btn-warning ml-1 text-light' onClick={() => setVisiblem(true)} >clôture ventes retardées</button>

                  <div class="card shadow mb-4 mt-2">
                    <div class="card-header py-3 d-flex">
                      <h6 class="m-0 font-weight-bold text-primary ">Historique de ventes</h6>

                    </div>
                    <div class="card-body">
                      <DataTable ref={dt} value={vente} paginator rows={20}
                        dataKey="ID_Vente"
                        selectionMode="single" size='small'
                        selection={selectedVente} onSelectionChange={(e) => setSelectedVente(e.value)}
                        header={header} globalFilter={globalFilter}
                        className="p-datatable-customers"
                        emptyMessage="pas de données." >
                        <Column field="ID_Vente" header="#" className='text-center' />
                        <Column field="actions" header="N° Facture" />
                        <Column field="nomclient" header="Client" />
                        <Column field="telephoneclient" header="Phone" />
                        <Column field="libelletarif" header="Libellé" />
                        <Column field='montant' header="Prix unitaire" body={formate_number} className='text-center' />
                        <Column field="quantite" header="quantité" className='text-center' />
                        <Column field="reste" header="Prix total" className='text-center' body={formate_number_total} />

                        <Column field="status_vente" header="status" className='text-center' />
                        <Column field="created_at" header="Date" className='text-center' />
                        <Column field="nom" header="Opérateur" />

                      </DataTable>

                    </div>
                  </div>

                </div>
              </div>

              <footer class="sticky-footer bg-white">
                <div class="container my-auto">
                  <div class="copyright text-center my-auto">
                    <span>Copyright &copy;rovenservicespro-Version 1.0.1</span>
                  </div>
                </div>
              </footer>

            </div>
          }
        </div>

      </div>

    </div>
  );
}

export default Historique;