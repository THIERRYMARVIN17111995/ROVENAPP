import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
function Vente() {

  const navigate = useNavigate();
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
  console.log("error " + valuemont)
  console.log("Client " + ID_Client)
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

  const select_data_liste_client_by_id = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/list_client_by_id/${id}`);
      if (response.data.status === 200) {

        setClient(response.data.client);


      }
    } catch (Error) {

    }


  }
  const select_data_liste_grille = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/liste_tarif");
    
        setTarif(response.data);


  
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

  const addVente = async () => {

    try {
      const response = await axios.post(URL_AXIOS + '/vente_store', {
        actions: "observation",
        montant: montant,
        avance: avance,
        reste: (selectedDropdownTarif.montant * avance),
        observation: observation,
        ID_Employe: ID_Employe_value,
        ID_Client: selectedDropdownVente.ID_Client,
        ID_Tarif: selectedDropdownTarif.ID_Tarif,
        quantite: avance
      });

      if (response.data.status === 200) {
        setActions("");
        setAvance(1);
        setMontant(0);
        setReste(0)
        setValuemont(0);
        select_data_vente();
        getTotalVente();
        setID_Client("");
        showSuccess();
        setSelectedDropdownTarif(null);
      }
    } catch (Error) {

    }

  }


  const updateVente = async (id) => {

    try {
      const response = await axios.post(URL_AXIOS + `/vente_update/${id}`, {
        actions: "observation",
        montant: montant,
        avance: avance,
        reste: (montant * avance),
        observation: observation,
        ID_Employe: ID_Employe_value,
        ID_Client: ID_Client,
        ID_Tarif: valuemont,
        quantite: avance
      });

      if (response.data.status === 200) {


        select_data_vente();
        getTotalVente();
        setVisibleModif(false);
        showSuccess();
      }
    } catch (Error) {

    }

  }
  const deleteVente = async (id) => {
    try {
      const response = await axios.post(URL_AXIOS + `/vente_delete/${id}`);
      if (response.data.status === 200) {
        select_data_vente();
        setVisiblemo(false)
      }
    } catch (Error) {

    }


  }
  const getDataClient = async (id) => {

    const response = await axios.get(URL_AXIOS + `/client/${id}`);
    if (response.data.status === 200) {

      return response.data.client.nomclient



    }

  }
  const editVente = () => {
    setID_Client(selectedVente.ID_Client)
    setValuemont(selectedVente.ID_Tarif)
    setActions(selectedVente.actions)
    setAvance(selectedVente.avance)
    setObservation(selectedVente.observation)
    setID_Vente(selectedVente.ID_Vente)
    const array_client = [{
      ID_Client: selectedVente.ID_Client,
      nomclient: selectedVente.nomclient
    }];
    // setClient(array_client)
    setVisibleModif(true)

  }
  const select_data_client = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/client");
      if (response.data.status === 200) {

        setClient(response.data.client);


      }
    } catch (Error) {

    }


  }

  const addClient = async () => {
    try {
      const response = await axios.post(URL_AXIOS + '/client', {
        nomclient: nomclient,
        telephoneclient: telephoneclient,
        ID_Employe: ID_Employe_value
      });
      if (response.data.status === 200) {
        console.log(response.data.message)
        setNomclient("");
        setTelephoneclient("");
        select_data_client();
      }
    } catch (Error) {

    }

  }

  const select_data_vente = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/vente");
      if (response.data.status === 200) {

        setVente(response.data.vente);
        console.log(response.data.vente)
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
  const renderFooter = () => {
    return (
      <div>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setVisiblem(false)} />
        <Button label="Yes" icon="pi pi-check" autoFocus onClick={() => closeSell(ID_Employe_value)} />
      </div>
    );
  }
  const visualize_before_print = () => {
    if (selectedVente.ID_Client === 0) {
      showError("Veuillez sélectionner la ligne ")
    } else if (selectedVente.ID_Client !== 0) {
      navigate(`/facture/${selectedVente.ID_Client}`)
    }
    const replacedString = selectedVente.actions.replace(/\//g, '_');
    sessionStorage.setItem("status_retour", "V");
    sessionStorage.setItem("m", selectedVente.created_at);
    sessionStorage.setItem("status", selectedVente.status_vente_fact);
    sessionStorage.setItem("numfact",replacedString);
  }

  const renderFooter_second = () => {
    return (
      <div>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setVisiblemo(false)} />
        <Button label="Yes" icon="pi pi-check" autoFocus onClick={() => deleteVente(selectedVente.ID_Vente)} />
      </div>
    );
  }
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
    select_data_client();
    select_data_liste_grille();
    getTotalVente();

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
      <Dialog header="Confirmation" visible={visiblem} modal style={{ width: '350px' }} footer={renderFooter('visiblem')} onHide={() => setVisiblem(false)}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          <span className='ml-2'>Voulez fermer la vente ?</span>
        </div>
      </Dialog>

      <Dialog header="Confirmation" visible={visiblemo} modal style={{ width: '350px' }} footer={renderFooter_second('visiblemo')} onHide={() => setVisiblemo(false)}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          <span className='ml-2'>Voulez supprimer cette  ligne d'information ?</span>
        </div>
      </Dialog>
      <Dialog header="Modification date vente" visible={visible_dialog} style={{ width: '25vw' }} onHide={() => setVisible_dialog(false)}>
      <Calendar value={date} onChange={(e) => setDate(e.value)} dateFormat="yy/mm/dd" style={{width:330}}/><br/><br/>
       <button className='btn btn-warning text-light' style={{width:330}}>Mettre à jour</button>
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

                <div className="col col-md-6 d-flex">


                  <button type="button" onClick={() => setVisible(true)} class="btn btn-success">
                    Nouvelle
                  </button>

                  <button type="button" class="btn btn-warning text-light ml-2" onClick={() => setVisiblem(true)}>
                    Clôturer vente
                  </button>
                  <button type="button" onClick={() => navigate('/historique')} class="btn btn-info text-light ml-2 d-none" >
                    Historique vente
                  </button>

                  {
                    roleuser === 'A' ? <button type="button" style={{display:'none'}} onClick={() => setVisible_dialog(true)} class="btn btn-info text-light ml-2">
                      Met à jour la date vente
                    </button> : ''
                  }
                  <button type="button" onClick={() => visualize_before_print()} class="btn btn-primary text-light ml-2">
                    imprimer facture
                  </button>

                </div>
              </div>
              <br />
              <Dialog header="Nouvelle vente" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <form>
                  <div>
                    <label>Client *:</label>
                  </div>
                  {/* <div className='form-group d-flex'>

                  <select className='form-control col-md-12' name='ID_Client' value={ID_Client} onChange={(e) => setID_Client(e.target.value)} placeholder='Veuillez sélectionner le client '>

                    <option>Veuillez selectionner le client</option>
                    {client.map((c) => (
                      <option key={c.ID_Client} value={c.ID_Client}>{c.nomclient}</option>
                    ))}

                  </select>
                
                    </div>*/}
                  <div className='form-group'>
                    <Dropdown value={selectedDropdownVente} onChange={(e) => setSelectedDropdownVente(e.value)} options={client} optionLabel="nomclient" placeholder="Selectionner un client"
                      filter valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate} className="form-control"
                      style={{ height: '50px', paddingTop: '0px' }}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Travail à effectuer *:</label>
                    <Dropdown value={selectedDropdownTarif} onChange={(e) => setSelectedDropdownTarif(e.value)} options={tarif} optionLabel="libelletarif" placeholder="Selectionner un client"
                      filter valueTemplate={selectedCountryTemplate_tarif} itemTemplate={countryOptionTemplate_tarif} className="form-control"
                      style={{ height: '50px', paddingTop: '0px' }}
                    />

                  </div>
                  {/* <label>Travail à effectuer *:</label>
                <div className='form-group'>
                  <select className='form-control col-md-12' value={valuemont} onChange={(e) => setValuemont(e.target.value)} placeholder='Veuillez sélectionner le client '>

                    <option>Veuillez selectionner une action</option>
                    {tarif.map((c) => (
                      <option key={c.ID_Tarif} value={c.ID_Tarif}>{c.libelletarif}</option>
                    ))}

                  </select>
                  <input type='hidden' placeholder='Veuillez saisir le travail à effectuer' name='ID_Employe' value={ID_Employe_value} className="form-control col col-md-7" />
                </div>*/}
                  <div className='form-group d-flex'>
                    <label className='mt-2'>P.U :</label>
                    <input type='number' className='form-control col-md-2 ml-2' placeholder='Montant'
                      name='montant' value={selectedDropdownTarif !== null ? selectedDropdownTarif.montant : 0} onChange={(e) => setMontant(e.target.value)} />
                    <label className='mt-2 ml-2'>Quantité *:</label>
                    <input type='number' name='avance' value={avance} onChange={(e) => setAvance(e.target.value)} className='form-control col-md-2 ml-3' placeholder='Quantité' />
                    <label className='mt-2 ml-2'>P.T *:</label>
                    <input type='number' name='reste' value={(selectedDropdownTarif !== null ? selectedDropdownTarif.montant : 0) * avance} onChange={(e) => setReste(e.target.value)} className='form-control col-md-2 ml-3' placeholder='Net à payer' />
                  </div>
                  <div className='form-group'>
                    <textarea rows={10} className='form-control' placeholder='Observation' name='observation' value={observation} onChange={(e) => setObservation(e.target.value)} >

                    </textarea>
                  </div>
                  <div className='form-group d-flex'>
                    <button className='btn btn-info' type='button' onClick={() => addVente()}>Enregistrer</button>
                    <button className='btn btn-danger ml-2' type='button'>Annuler</button>

                  </div>

                </form>
              </Dialog>


              <Dialog header="Modification vente" visible={visibleModif} style={{ width: '50vw' }} onHide={() => setVisibleModif(false)}>
                <form>
                  <div>
                    <label>Client *:</label>
                  </div>
                  <div className='form-group'>
                    <Dropdown value={selectedDropdownVente} onChange={(e) => setSelectedDropdownVente(e.value)} options={client} optionLabel="nomclient" placeholder="Selectionner un client"
                      filter valueTemplate={selectedCountryTemplate} itemTemplate={countryOptionTemplate} className="form-control"
                      style={{ height: '50px', paddingTop: '0px' }}
                    />
                  </div>
                  <div className='form-group'>
                    <label>Travail à effectuer *:</label>
                    <Dropdown value={selectedDropdownTarif} onChange={(e) => setSelectedDropdownTarif(e.value)} options={tarif} optionLabel="libelletarif" placeholder="Selectionner un client"
                      filter valueTemplate={selectedCountryTemplate_tarif} itemTemplate={countryOptionTemplate_tarif} className="form-control"
                      style={{ height: '50px', paddingTop: '0px' }}
                    />

                  </div>
                  <input type='hidden' placeholder='Veuillez saisir le travail à effectuer' name='ID_Employe' value={ID_Employe_value} className="form-control col col-md-7" />

                  <div className='form-group d-flex'>
                    <label className='mt-2'>P.U :</label>
                    <input type='number' className='form-control col-md-2 ml-2' placeholder='Montant'
                      name='montant' value={montant} onChange={(e) => setMontant(e.target.value)} />
                    <label className='mt-2 ml-2'>Quantité *:</label>
                    <input type='number' name='avance' value={avance} onChange={(e) => setAvance(e.target.value)} className='form-control col-md-2 ml-3' placeholder='Quantité' />
                    <label className='mt-2 ml-2'>P.T *:</label>
                    <input type='number' name='reste' value={montant * avance} onChange={(e) => setReste(e.target.value)} className='form-control col-md-2 ml-3' placeholder='Net à payer' />
                  </div>
                  <div className='form-group'>
                    <textarea rows={10} className='form-control' placeholder='Observation' name='observation' value={observation} onChange={(e) => setObservation(e.target.value)} >

                    </textarea>
                  </div>
                  <div className='form-group d-flex'>
                    <button className='btn btn-info' type='button' onClick={() => updateVente(selectedVente.ID_Vente)}>Enregistrer</button>
                    <button className='btn btn-danger ml-2' type='button'>Annuler</button>

                  </div>

                </form>
              </Dialog>

              <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex">
                  <h6 class="m-0 font-weight-bold text-primary">Liste des ventes</h6>

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

                    <Column field="libelletarif" header="Libellé" />
                    <Column field="montant" header="Prix unitaire" className='text-center' body={formate_number} />
                    <Column field="quantite" header="quantité" className='text-center' />
                    <Column field="reste" header="Prix total" className='text-center' body={formate_number_total} />
                    <Column field="created_at" header="Date" className='text-center' />
                    <Column field="nom" header="Opérateur" />

                    <Column header="Options" body={actionBodyTemplate()} />
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

export default Vente;