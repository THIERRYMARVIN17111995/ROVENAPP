import { ProgressSpinner } from 'primereact/progressspinner';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { URL_AXIOS } from '../data/AxiosUrl';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
function Statistique() {
  const navigate = useNavigate();
  const roleuser = sessionStorage.getItem('Role');
  const value_session = sessionStorage.getItem('employe');
  const ID_Employe_value = sessionStorage.getItem('ID_Employe');
  const [loading, setloading] = useState(true);
  const [date, setDate] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visiblem, setVisiblem] = useState(false);
  const [vente, setVente] = useState([]);
  const [client, setClient] = useState([]);
  const [caisse, setCaisse] = useState([]);
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
  const toast = useRef(null);
  const [globalFilter, setGlobalFilter] = useState();
  const [visiblemo, setVisiblemo] = useState(false);
  const [visibleConfi, setVisibleConfi] = useState(false);
  const [visibleModif, setVisibleModif] = useState(false);
  const [selectedVente, setSelectedVente] = useState([]);
  const [proforma, setProforma] = useState([]);
  const [visibleConfirme, setVisibleConfirme] = useState(false);
  const [selectedDropdownVente, setSelectedDropdownVente] = useState(null);
  const [selectedDropdownTarif, setSelectedDropdownTarif] = useState(null);
  const dt = useRef(null);
  const cm = useRef(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const dateStart_two = new Date(dateStart).toDateString();
  const dateEnd_two = new Date(dateEnd).toDateString();
  const [cancel, setCancel] = useState(true);
  const [depense, setDepense] = useState(0);
  const [montant_en_caisse, setMontant_en_caisse] = useState(0);
  const [depense_array, setDepense_array] = useState([]);
  const logout = () => {
    sessionStorage.removeItem("ID_Employe");
    sessionStorage.removeItem("employe");
    navigate('/');
  }
  const items = [
    { label: 'Nouvelle facture', icon: 'pi pi-fw pi-plus' },

  ];
  const select_data_depense = async () => {
    const response = await axios.get(URL_AXIOS + "/depense_all");
    if (response.data.status === 200) {

      setDepense_array(response.data.depense);


    }

  }
  const exportColumns = vente.map((col) => ({ title: col.header, dataKey: col.field }));
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const select_data_caisse = async () => {
    const response = await axios.get(URL_AXIOS + "/caisse_suivi_all");
    if (response.data.status === 200) {

      setCaisse(response.data.caisse);


    }

  }
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
  };

  const exportExcel_recette = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(caisse);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'historique recettes');
    });
  };
  const exportExcel_depense = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(depense_array);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'historique dépenses');
    });
  };
  const customFilter = (value, dateStart, dateEnd) => {
    const dateSearch = new Date(value.created_at);

    if (dateStart === '' && dateEnd === '') {
      return value; // No filtering criteria, so return true to include the value
    } else if (dateStart !== '' && dateEnd === '') {
      return dateSearch >= new Date(dateStart); // Filter by start date only
    } else if (dateStart === '' && dateEnd !== '') {
      return dateSearch <= new Date(dateEnd); // Filter by end date only
    } else {
      return dateSearch >= new Date(dateStart) && dateSearch <= new Date(dateEnd); // Filter by range
    }
  };

  const exportExcel_pro = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(proforma);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'fichier_export');
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
  const select_data_vente = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/vente_history_all");
      if (response.data.status === 200) {

        setVente(response.data.vente);
        console.log(response.data.vente)
      }
    } catch (Error) {

    }


  }
  const Annuler_me = () => {
    select_data_vente();
    setCancel(true);
    setDateStart('');
    setDateEnd('');
    setTotal(0);
    setDepense(0);
    setMontant_en_caisse(0);
    select_data_caisse();
    select_data_depense();
  }
  const recherche_range = async () => {
    try {

      const response = await axios.post(URL_AXIOS + `/recherche_range/${dateStart_two}/${dateEnd_two}`);
      if (response.data.status === 200) {

        setVente(response.data.vente);
        setTotal(response.data.total);
        setDepense(response.data.depense);
        setMontant_en_caisse(response.data.montant_en_caisse);
        setCaisse(response.data.caisse);
        setDepense_array(response.data.depense_array);
        setCancel(false);
      }
    } catch (Error) {

    }


  }
  const formate_number = (data) => {
    return <p>{new Intl.NumberFormat().format(data.montant)}</p>
  }
  const formate_number_total = (data) => {
    return <p>{new Intl.NumberFormat().format(data.reste)}</p>
  }
  const header_proforma = (
    <div className="table-header flex align-items-center  gap-2">
      <span className="p-input-icon-left mt-0">
        <i className="pi pi-search mt-1" />
        <InputText type="search" className="txt_search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
        <Button type="button" icon="pi pi-file-excel" className='ml-2 ' style={{ height: '40px', width: '40px' }} severity="success" rounded onClick={exportExcel_pro} data-pr-tooltip="XLS" />
      </span>

    </div>
  );

  const header = (
    <div className="table-header flex align-items-center  gap-2">
      <span className="p-input-icon-left mt-0">
        <i className="pi pi-search mt-1" />
        <InputText type="search" className="txt_search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
        <Button type="button" icon="pi pi-file-excel" className='ml-2 ' style={{ height: '40px', width: '40px' }} severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
      </span>

    </div>
  );
  const header_recette = (
    <div className="table-header flex align-items-center  gap-2">
      <span className="p-input-icon-left mt-0">
        <i className="pi pi-search mt-1" />
        <InputText type="search" className="txt_search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
        <Button type="button" icon="pi pi-file-excel" className='ml-2 ' style={{ height: '40px', width: '40px' }} severity="success" rounded onClick={exportExcel_recette} data-pr-tooltip="XLS" />
      </span>

    </div>
  );
  const header_depense = (
    <div className="table-header flex align-items-center  gap-2">
      <span className="p-input-icon-left mt-0">
        <i className="pi pi-search mt-1" />
        <InputText type="search" className="txt_search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
        <Button type="button" icon="pi pi-file-excel" className='ml-2 ' style={{ height: '40px', width: '40px' }} severity="success" rounded onClick={exportExcel_depense} data-pr-tooltip="XLS" />
      </span>

    </div>
  );
  useEffect(() => {
    select_data_vente();
    select_data_caisse();
    select_data_depense();
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

                    <div class="col-xl-4 col-sm-6">
                      <div class="card card-mini mb-4">
                        <div class="card-body bg-warning text-light">
                          <h2 class="mb-1">{new Intl.NumberFormat().format(total)} XAF</h2>
                          <p>Montant vendu </p>

                        </div>
                      </div>
                    </div>
                    <div class="col-xl-4 col-sm-6">
                      <div class="card card-mini  mb-4">
                        <div class="card-body bg-danger text-light">
                          <h2 class="mb-1">{new Intl.NumberFormat().format(depense)} XAF</h2>
                          <p>Dépense</p>

                        </div>
                      </div>
                    </div>
                    <div class="col-xl-4 col-sm-6">
                      <div class="card card-mini mb-4">
                        <div class="card-body bg-info text-light">
                          <h2 class="mb-1">{new Intl.NumberFormat().format(montant_en_caisse)} XAF</h2>
                          <p>Caisse</p>

                        </div>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
              <div className=" flex justify-content-center">
                <label style={{ marginTop: 10 }}>Date début : </label>
                <Calendar value={dateStart} onChange={(e) => setDateStart(e.value)} style={{ width: 150, marginLeft: 15, height: 40 }} dateFormat="dd/mm/yy" />
                <label style={{ marginLeft: 15, marginTop: 10 }}>Date fin : </label>
                <Calendar value={dateEnd} onChange={(e) => setDateEnd(e.value)} style={{ width: 150, marginLeft: 15, height: 40 }} dateFormat="dd/mm/yy" />
                <button type='submit' style={{ marginLeft: 10, }} className={cancel ? 'btn btn-info text-light' : 'btn btn-danger text-light'} onClick={() => { cancel ? recherche_range() : Annuler_me() }}>{cancel ? 'Recherche' : 'X'}</button>
              </div>
              <TabView style={{ marginTop: 10 }}>
                <TabPanel header="Liste factures" >
                  <DataTable ref={dt} value={vente} paginator rows={20}
                    dataKey="ID_Vente"
                    selectionMode="single" size='small'
                    selection={selectedVente} onSelectionChange={(e) => setSelectedVente(e.value)}
                    header={header}
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
                </TabPanel>
                <TabPanel header="Liste Recettes" >
                  <DataTable value={caisse} paginator rows={10}

                    dataKey="ID_Caisse"
                    selectionMode="single" size='small'

                    header={header_recette} globalFilter={globalFilter}

                    className="p-datatable-customers"
                    emptyMessage="pas de données." >

                    <Column field="ID_Caisse" header="#" />
                    <Column field="montant" header="Montant" body={formate_number} />
                    <Column field="created_at" header="Date" />
                    <Column field="nom" header="Opérateur" />

                  </DataTable>
                </TabPanel>
                <TabPanel header="Liste Dépenses" >

                  <DataTable value={depense_array} paginator rows={10}

                    dataKey="ID_Depense"
                    selectionMode="single" size='small'
                    header={header_depense} globalFilter={globalFilter}

                    className="p-datatable-customers"
                    emptyMessage="pas de données." >

                    <Column field="ID_Depense" header="#" />
                    <Column field="motif" header="motif" />
                    <Column field="montant" header="montant" body={formate_number} />
                    <Column field="created_at" header="Date" />
                    <Column field="nom" header="Opérateur" />

                  </DataTable>
                </TabPanel>
              </TabView>
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

export default Statistique;