import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Panel } from 'primereact/panel';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { URL_AXIOS } from '../data/AxiosUrl';
function AddVente() {

  const { id } = useParams();
  const navigate = useNavigate();
  const value_session = sessionStorage.getItem('employe');
  const value_ID = sessionStorage.getItem('ID_Employe');
  const [caisse, setCaisse] = useState(0);
  const [depense, setDepense] = useState(0);
  const [visible, setVisible] = useState(false);
  const [visiblem, setVisiblem] = useState(false);
  const [depense_caisse, setDepense_caisse] = useState(0);
  const [client, setClient] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [globalFilter, setGlobalFilter] = useState();
  const [nomclient, setNomclient] = useState("");
  const [tarif, setTarif] = useState([]);
  const [selectedTarif, setSelectedTarif] = useState([]);
  const [telephoneclient, setTelephoneclient] = useState("");
  const [ID_Client, setID_Client] = useState("");
  const [libelletarif, setLibelletarif] = useState("");
  const [montant, setMontant] = useState(0);
  const [ID_Tarif,setID_Tarif]=useState(0);
  const [ID_vente,setID_Vente]=useState(0);
  const [quantite,setQuantite]=useState(1);
  const [total,setTotal]=useState(montant*quantite);
  const [selectedVente, setSelectedVente] = useState([]);
  const [observation,setObservation]=useState("");
  const ID_Employe_value = sessionStorage.getItem('ID_Employe');
  const dateexport = sessionStorage.getItem('dateexport');
  const toast = useRef(null);
  const select_data_client = async () => {
    const response = await axios.get(URL_AXIOS+"/client");
    if (response.data.status === 200) {

      setClient(response.data.client);


    }

  }
  /*const getDataClient = async (id) => {

    const response = await axios.get(URL_AXIOS+`/client/${id}`);
    if (response.data.status === 200) {

      setNomclient(response.data.client.nomclient)
      setTelephoneclient(response.data.client.telephoneclient)
      setID_Client(response.data.client.ID_Client)


    }

  }*/

  const select_data_grille_by_id_load_by_first = async (id) => {
    try {
      const response = await axios.get(URL_AXIOS+`/vente_list_first/${dateexport}/${id}`);
      if (response.data.status === 200) {

        setSelectedVente(response.data.vente);
        setNomclient(response.data.vente.nomclient)
      setTelephoneclient(response.data.vente.telephoneclient)
      setID_Client(response.data.vente.ID_Client)
      setMontant(response.data.vente.montant)
      setQuantite(response.data.vente.avance)
      setLibelletarif(response.data.vente.libelletarif)
      setID_Tarif(response.data.vente.ID_Tarif)
      setID_Vente(response.data.ID_vente);
      console.log(ID_vente)
      }
    } catch (Error) {
     //console.log("Date : "+dateexport)
    }


  }
  const select_data_liste_grille = async () => {
    const response = await axios.get(URL_AXIOS+"/liste_tarif");
    if (response.data.status === 200) {

      setTarif(response.data.tarif);


    }

  }
  const logout = () => {
    sessionStorage.removeItem("ID_Employe");
    sessionStorage.removeItem("employe");
    navigate('/');
  }
 /* const getTotalVente = async () => {
    try {
      const response = await axios.get(URL_AXIOS+"/caisse");
      if (response.data.status === 200) {

        setCaisse(response.data.total);
        console.log("Total :" + response.data.total)

      }
    } catch (Error) {

    }


  }*/
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
  const charger_data_client = () => {
    setNomclient(selectedClient.nomclient);
    setID_Client(selectedClient.ID_Client);
    setVisible(false);
  }
  const charger_data_grille=()=>{
    setLibelletarif(selectedTarif.libelletarif);
    setMontant(selectedTarif.montant);
    setID_Tarif(selectedTarif.ID_Tarif);
    setVisiblem(false);
  }
 /* const getTotal_en_caisse = async () => {
    try {
      const response = await axios.get(URL_AXIOS+"/difference_caisse_depense");
      if (response.data.status === 200) {

        setDepense_caisse(response.data.total);


      }
    } catch (Error) {

    }


  }
*/
  const updateVente = async (id) => {
    console.log(montant+" "+quantite+" "+total+" "+ID_Client+" "+ID_Tarif)
    try {
      const response = await axios.post(URL_AXIOS+`/vente_update/${id}`, {
        actions: "observation",
        montant: montant,
        avance: quantite,
        reste: (montant*quantite),
        observation: observation,
        ID_Employe:ID_Employe_value,
        ID_Client:ID_Client,
        ID_Tarif:ID_Tarif,
        quantite:quantite
      });

      if (response.data.status === 200) {

      
       // select_data_vente();
       // getTotalVente();
       // setVisibleModif(false);
        showSuccess();
        navigate('/vente');
      }else{
        showSuccess();
      }
    } catch (Error) {

    }

  }
  /*const getTotalDepense = async () => {
    try {
      const response = await axios.get(URL_AXIOS+"/count_depense");
      if (response.data.status === 200) {

        setDepense(response.data.total);


      }
    } catch (Error) {

    }


  }*/

  const header = (
    <div className="table-header d-flex">
      <span className="p-input-icon-left mt-0">
        <i className="pi pi-search mt-1" />
        <InputText type="search" className="txt_search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
      </span>

    </div>
  );
  useEffect(() => {
    //getTotalVente();
    //getTotalDepense();
    //getTotal_en_caisse();
    select_data_client();
    select_data_liste_grille();
    if (id === "undefined") {
      navigate('/vente')
    } else {
      //getDataClient(id);
      select_data_grille_by_id_load_by_first(id)
    }
    //select_data_grille_by_id_load_by_first(id)
  }, []);
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
                <a class="nav-link" href="#"  onClick={() => logout()}>
                        <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-red-400"></i>
                        Déconnexion
                    </a>
            </li>

        </ul>



    </nav>
          <div className='container-fluid'>
            <div class="content-wrapper">
              <Dialog header="Liste clients" visible={visible} onHide={() => setVisible(false)}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <DataTable value={client} paginator rows={5}

                  dataKey="ID_Client"
                  selectionMode="single" size='small'
                  selection={selectedClient} onSelectionChange={(e) => setSelectedClient(e.value)}
                  header={header} globalFilter={globalFilter}

                  className="p-datatable-customers"
                  emptyMessage="pas de données." >

                  <Column field="ID_Client" header="#" />
                  <Column field="nomclient" header="Client" />
                  <Column field="telephoneclient" header="Phone" />


                </DataTable>
                <button className='btn btn-info mt-2' onClick={() => charger_data_client()}>Charger</button>
              </Dialog>

              <Dialog header="grille tarifaire" visible={visiblem} onHide={() => setVisiblem(false)}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <DataTable value={tarif} paginator rows={5}
                  selectionMode="single" size='small'
                  selection={selectedTarif} onSelectionChange={(e) => setSelectedTarif(e.value)}
                  header={header} globalFilter={globalFilter}
                  className="p-datatable-customers"
                  emptyMessage="pas de données." >
                  <Column field="ID_Tarif" header="#" />
                  <Column field="libelletarif" header="Libellé" />
                  <Column field="montant" header="Montant" />


                </DataTable>
                <button className='btn btn-info mt-2' onClick={() => charger_data_grille()}>Charger</button>
              </Dialog>
              <div class="content">
                <Panel header="Modification vente" >
                  <form>
                    <div className="form-group">
                      <InputText className="p-inputtext-sm" value={nomclient} style={{ width: '500px' }} placeholder="veuillez sélectionner le client" />
                      <Button type='button' label="" style={{ height: '42px' }} icon="pi pi-external-link" className='ml-1' onClick={() => setVisible(true)} />
                      <InputText value={ID_Client} type='hidden' onChange={(e)=>setID_Client(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <InputText value={libelletarif} className="p-inputtext-sm" style={{ width: '500px' }} placeholder="veuillez sélectionner le travail à effectuer" />
                      <Button type='button' label="" style={{ height: '42px' }} icon="pi pi-external-link" className='ml-1' onClick={() => setVisiblem(true)} />
                      <InputText value={selectedTarif.ID_Tarif} type='hidden' onChange={(e)=>setID_Tarif(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <InputText className="p-inputtext-sm" value={montant} onClick={(e)=>setMontant(e.target.value)}/>
                      <InputText value={quantite} onChange={(e)=>setQuantite(e.target.value)} type="number" className="p-inputtext-sm  ml-1" />
                      <InputText className="p-inputtext-sm  ml-1"  value={montant*quantite} onChange={(e)=>setTotal(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <textarea rows={5} className='form-control' value={observation} onClick={(e)=>setObservation(e.target.value)}>

                      </textarea>
                    </div>
                    <div className='form-group'>
                      <button type='button' className='btn btn-warning' onClick={()=>updateVente(id)}>Modifier</button>
                      <button type='button' onClick={() => navigate('/vente')} className='btn btn-success mt-1 ml-1 text-light text-center pi pi-backward ' style={{height:'35px'}}></button>
                    </div>
                  </form>
                </Panel>
              </div>
            </div>
          </div>
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

export default AddVente;