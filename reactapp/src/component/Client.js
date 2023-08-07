import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { URL_AXIOS } from '../data/AxiosUrl';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from "primereact/radiobutton";
function Client() {
  const navigate = useNavigate();
  const value_session = sessionStorage.getItem('employe');
  const ID_Employe_value = sessionStorage.getItem('ID_Employe');
  const roleuser = sessionStorage.getItem('Role');
  const { id } = useParams();
  const [date, setDate] = useState(null);
  const [nomclient, setNomclient] = useState("");
  const [telephoneclient, setTelephoneclient] = useState("");

  const [client, setClient] = useState([]);
  const [dataget, setDataget] = useState([]);
  const [ID_Client, setID_Client] = useState("");
  const [obj, setObj] = useState([]);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visiblem, setVisiblem] = useState(false);
  const [visibleConfi, setVisibleConfi] = useState(false);
  const [globalFilter, setGlobalFilter] = useState();
  const [client_data, setClient_data] = useState();
  const [selectedClient, setSelectedClient] = useState([]);
  const [loading, setloading] = useState(true);
  const [ingredient, setIngredient] = useState('');
  const logout = () => {
    sessionStorage.removeItem("ID_Employe");
    sessionStorage.removeItem("employe");
    navigate('/');
  }
  console.log(client_data)
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

  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(client);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'Liste des clients');
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
  const getDataClient = async (id) => {

    const response = await axios.get(URL_AXIOS + `/client/${id}`);
    if (response.data.status === 200) {

      setNomclient(response.data.client.nomclient)
      //setTelephoneclient(response.data.client.telephoneclient)
      setID_Client(response.data.client.ID_Client)


    }

  }
  console.log(ID_Employe_value)
  const supprimerClient = async (id) => {

    const response = await axios.post(URL_AXIOS + `/delete/${selectedClient.ID_Client}`);
    if (response.data.status === 200) {

      select_data_client();
      setVisibleConfi(false)

    }

  }

  const histo_client = () => {
    if (selectedClient && selectedClient.ID_Client && selectedClient.ID_Client !== 0) {
      navigate(`/historique_client/${selectedClient.ID_Client}`);
    } else {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Veuillez sélectionner la ligne !', life: 3000 });
    }
  };
  
  
  const addClient = async () => {
    const response = await axios.post(URL_AXIOS + '/client', {
      nomclient: nomclient,
      telephoneclient: telephoneclient,
      ID_Employe: ID_Employe_value,
      type_client: ingredient
    });
    if (response.data.status === 200) {
      console.log(response.data.message)
      setNomclient("");
      setTelephoneclient("");
      select_data_client();
      showSuccess();
    } else {

    }
  }

  const updateClient = async (id) => {
    const response = await axios.post(URL_AXIOS + `/update/${id}`, {
      nomclient: nomclient,
      telephoneclient: telephoneclient,
      ID_Employe: ID_Employe_value,
      type_client:ingredient
    });
    if (response.data.status === 200) {


      setNomclient("");
      setTelephoneclient("");
      select_data_client();
      setVisiblem(false);
      
    }
  }

  const select_data_client = async () => {
  
    const response = await axios.get(URL_AXIOS + "/client");
    if (response.data.status === 200) {

      setClient(response.data.client);
      //alert(response.data.client)

    }

  }
  const editProduct = (product) => {

    setClient_data(product);
    setNomclient(selectedClient.nomclient);
    setTelephoneclient(selectedClient.telephoneclient);
    setID_Client(selectedClient.ID_Client);
    setVisiblem(true);
    setIngredient(selectedClient.type_client);

  }
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning p-mr-2 " style={{ width: '40px', height: '40px' }} onClick={() => editProduct(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger ml-2 b_edit_sup" style={{ width: '40px', height: '40px' }} onClick={() => setVisibleConfi(true)} />

      </React.Fragment>
    );
  }
  const cancelled_delete = () => {

    setVisibleConfi(false)
    select_data_client();
  }
  const renderFooter = () => {
    return (
      <div>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => cancelled_delete()} />
        <Button label="Yes" icon="pi pi-check" autoFocus onClick={() => supprimerClient(ID_Client)} />
      </div>
    );
  }
  const header = (
    <div className="table-header d-flex">
      <span className="p-input-icon-left mt-0">
        <i className="pi pi-search mt-1" />
        <InputText type="search" className="txt_search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
      </span>

    </div>
  );

  useEffect(() => {

    select_data_client();
    setTimeout(() => {
      setloading(false)
    }, 1000)
    if (ID_Employe_value === null) {
      navigate('/')
    }
  }, []);
  return (
    <div id="wrapper">
      <Dialog header="Confirmation" visible={visibleConfi} modal style={{ width: '350px' }} footer={renderFooter('visiblem')} onHide={() => setVisiblem(false)}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          <span className='ml-2'>Voulez fermer supprimer ce client ?</span>
        </div>
      </Dialog>
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
              <div className='row'>

                <div className="col col-md-1">

                  <button type="button" class="btn btn-success" data-toggle="modal" data-target="#exampleModalCenter3"
                    onClick={() => setVisible(true)}>
                    Nouveau
                  </button>
                  <Button type='button' label='Exporter' onClick={()=>exportExcel()} icon="pi pi-file-excel"   style={{ height: '37px', width: '130px',marginLeft:10 }} severity="success" />
                  <button type="button" onClick={()=>histo_client()} class="btn btn-warning text-light " style={{marginLeft:10}} >Voir l'historique</button>
                 
                </div>
              </div>
              <br />


              <Dialog header="Nouveau client" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <form>



                  <div className='form-group'>
                    <input type="text" placeholder='Saisissez nom client' value={nomclient} onChange={(e) => setNomclient(e.target.value)} name="nomclient" className='form-control' />
                    <input type="hidden" value={ID_Employe_value} name='ID_Employe' placeholder='Saisissez nom client' className='form-control' />
                  </div>
                  <div className='form-group'>

                    <input type="text" placeholder='Saisissez numéro de téléphone client' value={telephoneclient} onChange={(e) => setTelephoneclient(e.target.value)} name="telephoneclient" className='form-control' />
                  </div>
                  <div className='form-group'>
                    <div className="flex">
                      <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                          <RadioButton inputId="ingredient1"  value="Particulier" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Particulier'} />
                          <label htmlFor="ingredient1" className="ml-2">Particulier</label>
                        </div>
                        <div className="flex align-items-center">
                          <RadioButton inputId="ingredient2" value="Entreprise" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Entreprise'} />
                          <label htmlFor="ingredient2" className="ml-2">Entreprise</label>
                        </div>


                      </div>
                    </div>
                  </div>
                  <div className='form-group'>

                    <button type="button" class="btn btn-primary" onClick={() => addClient()}>Ajouter</button>
                  </div>

                </form>
              </Dialog>

              <Dialog header="Modification client" visible={visiblem} style={{ width: '50vw' }} onHide={() => setVisiblem(false)}>
                <form>


                  <div>
                    <div className='form-group'>
                      <input type="text" placeholder='Saisissez nom client' value={nomclient} onChange={(e) => setNomclient(e.target.value)} name="nomclient" className='form-control' />
                      <input type="hidden" value={ID_Employe_value} name='ID_Employe' placeholder='Saisissez nom client' className='form-control' />
                      <input type="hidden" value={ID_Client} name='ID_Client' s placeholder='Saisissez nom client' className='form-control' />
                    </div>
                    <div className='form-group'>

                      <input type="text" placeholder='Saisissez numéro de téléphone client' value={telephoneclient} onChange={(e) => setTelephoneclient(e.target.value)} name="telephoneclient" className='form-control' />
                    </div>
                    <div className='form-group'>
                    <div className="flex">
                      <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                          <RadioButton inputId="ingredient1" name="pizza" value="Particulier" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Particulier'} />
                          <label htmlFor="ingredient1" className="ml-2">Particulier</label>
                        </div>
                        <div className="flex align-items-center">
                          <RadioButton inputId="ingredient2" name="pizza" value="Entreprise" onChange={(e) => setIngredient(e.value)} checked={ingredient === 'Entreprise'} />
                          <label htmlFor="ingredient2" className="ml-2">Entreprise</label>
                        </div>


                      </div>
                    </div>
                  </div>
                    <div className='form-group'>

                      <button type="button" class="btn btn-primary" onClick={() => updateClient(ID_Client)}>Modifier</button>
                    </div>
                  </div>
                </form>
              </Dialog>

              <div class="card shadow mb-4">
                <div class="card-header py-3">
                  <h6 class="m-0 font-weight-bold text-primary " >Liste des clients</h6>

                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <DataTable value={client} paginator rows={10}

                      dataKey="ID_Client"
                      selectionMode="single" size='small'
                      selection={selectedClient} onSelectionChange={(e) => setSelectedClient(e.value)}
                      header={header} globalFilter={globalFilter}

                      className="p-datatable-customers"
                      emptyMessage="pas de données." >

                      <Column field="ID_Client" header="#" />
                      <Column field="nomclient" header="Client" />
                      <Column field="type_client" header="type client" />
                      <Column field="telephoneclient" header="Phone" />
                      <Column field="created_at" header="Date" />
                      <Column field="nom" header="Opérateur" />
                      <Column header="Options" body={actionBodyTemplate(selectedClient.ID_Client)} />
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
              <span>Copyright &copy;rovenservicespro-Version 1.0.1</span>
            </div>
          </div>
        </footer>
      </div>

    </div>
  )
}

export default Client;