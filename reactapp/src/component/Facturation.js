import axios from 'axios';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
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
import { TabView, TabPanel } from 'primereact/tabview';
import { ContextMenu } from 'primereact/contextmenu';
import { Dropdown } from 'primereact/dropdown';
import { Document, Page } from 'react-pdf';

function Facturation() {

  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const roleuser = sessionStorage.getItem('Role');
  const value_session = sessionStorage.getItem('employe');
  const ID_Employe_value = sessionStorage.getItem('ID_Employe');
  const [visible, setVisible] = useState(false);
  const [visiblen, setVisiblen] = useState(false);
  const [visiblem, setVisiblem] = useState(false);
  const [vente, setVente] = useState([]);
  const [client, setClient] = useState([]);
  const [nomclient, setNomclient] = useState("");
  const [telephoneclient, setTelephoneclient] = useState("");
  const [ID_Client, setID_Client] = useState("");
  const [actions, setActions] = useState("");
  const [montant, setMontant] = useState(0);
  const [avance, setAvance] = useState(1);
  const [quantite, setQuantite] = useState(1);
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
  const [selectedVentepro, setSelectedVentepro] = useState([]);
  const [proforma, setProforma] = useState([]);
  const [visibleConfirme, setVisibleConfirme] = useState(false);
  const [selectedDropdownVente, setSelectedDropdownVente] = useState(null);
  const [selectedDropdownTarif, setSelectedDropdownTarif] = useState(null);
  const [status, setStatus] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [status_btn, setStatus_btn] = useState(false);
  const [numFacture, setnumFacture] = useState("01");
  const dt = useRef(null);
  const input_montant = useRef(null);


  const convert_FP_TO_F = async () => {
    try {
      if (selectedVentepro.actions == null || selectedVentepro.actions === "") {
        toast.current.show({ severity: 'warning', summary: 'warning', detail: 'Veuillez sélectionner la ligne svp !', life: 3000 });
      } else {
        const response = await axios.post(URL_AXIOS + '/vente_update_FP_TO_F', {
          codefacture: selectedVentepro.actions,
          ID_Employe: ID_Employe_value,
          ID_Client: selectedVentepro.ID_Client
        });
        if (response.data.status === 200) {
          select_data_vente_proforma();
        }
      }

    } catch (error) {
      alert("Error occurred: " + error);

    }
  };


  const items = [
    { label: 'Nouvelle facture', icon: 'pi pi-fw pi-plus' },

  ];

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

  const addVente = async () => {
    alert("CLIENT :"+selectedDropdownVente.ID_Client+" Tarif "+selectedDropdownTarif.ID_Tarif+"Emploie "+ID_Employe_value)
    const vente_data = {
      actions: "observation",
      montant: montant,
      avance: quantite,
      reste: (montant * quantite),
      observation: observation,
      ID_Employe: ID_Employe_value,
      ID_Client: selectedDropdownVente.ID_Client,
      ID_Tarif: selectedDropdownTarif.ID_Tarif,
      quantite: quantite,
      num_fact_pro: numFacture
    }
    try {

      const response = await axios.post(URL_AXIOS + '/vente_store_pro', vente_data);

      if (response.data.status === 200) {
        setActions("");
        setAvance(1);
        setQuantite(1)
        setMontant(0);
        setReste(0)
        setValuemont(0);
        select_data_vente();
        getTotalVente();
        setID_Client("");
        showSuccess();
        setSelectedDropdownTarif(null);
        select_data_vente_proforma();

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
      const response = await axios.post(URL_AXIOS + `/vente_fermer_late/${id}`, {
        ID_Employe: ID_Employe_value,
        created_at: selectedVente.created_at
      });
      if (response.data.status === 200) {
        select_data_vente();
        setVisiblem(false)


      }
    } catch (Error) {

    }


  }

  const deleteVente = async (id) => {
    try {
      const response = await axios.post(URL_AXIOS + `/vente_delete/${id}`);
      if (response.data.status === 200) {
        select_data_vente();

      }
    } catch (Error) {

    }


  }



  const confirm1 = () => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (selectedVentepro.status_vente === 0) {
          deleteVente(selectedVentepro.ID_Vente);
          select_data_vente_proforma();
        }

      },
      reject
    });
  };
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


  const statusBodyTemplate = (rowData) => {
    return <Tag severity={rowData.status_vente == 1 ? "success" : "warning"} value={rowData.status_vente == 1 ? "Fermée" : "Ouverte"}></Tag>
  };



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
        console.log(response.data.vente)
      }
    } catch (Error) {

    }


  }
  const handleTabChange = (event) => {
    // Perform actions when the TabPanel is clicked
    if (event.index === 0) {
      setStatus_btn(false)
      setActiveIndex(0)
    } else {
      setStatus_btn(true)
      setActiveIndex(1)
    }
  };

  const select_data_vente_proforma = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/vente_history_FP");
      if (response.data.status === 200) {

        setProforma(response.data.vente);

      }
    } catch (Error) {

    }


  }
  const actionBodyTemplate = () => {
    return (
      <React.Fragment>

        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger ml-2 b_edit_sup" style={{ width: '40px', height: '40px' }} onClick={() => confirm1()} />
      </React.Fragment>
    );
  }
  const actionCheck = (rowData) => {
    return (
      <React.Fragment>

        <Checkbox onChange={e => setChecked(rowData.status_vente == 1 ? true : false)} checked={checked}></Checkbox>
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

  const header_proforma = (
    <div className="table-header flex align-items-center  gap-2">
      <span className="p-input-icon-left mt-0">
        <i className="pi pi-search mt-1" />
        <InputText type="search" className="txt_search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
        <Button type="button" icon="pi pi-file-excel" className='ml-2 ' style={{ height: '40px', width: '40px' }} severity="success" rounded onClick={exportExcel_pro} data-pr-tooltip="XLS" />
      </span>

    </div>
  );
  const visualize_before_print = () => {
    try {

      if (activeIndex == 0) {
        if (selectedVente.ID_Client !== 0) {
          navigate(`/facture/${selectedVente.ID_Client}`);

        }
        const replacedString_one = selectedVente.actions.replace(/\//g, '_');
        sessionStorage.setItem("status_retour", "H");
        sessionStorage.setItem("m", selectedVente.created_at);
        sessionStorage.setItem("status", selectedVente.status_vente_fact);
        sessionStorage.setItem("numfact", replacedString_one);
      } else if (activeIndex == 1) {
        if (selectedVentepro.ID_Client !== 0) {
          navigate(`/facture/${selectedVentepro.ID_Client}`);

        }
        const replacedString = selectedVentepro.actions.replace(/\//g, '_');
        sessionStorage.setItem("status_retour", "H");
        sessionStorage.setItem("m", selectedVentepro.created_at);
        sessionStorage.setItem("status", selectedVentepro.status_vente_fact);
        sessionStorage.setItem("numfact", replacedString);
      }
    } catch (error) {

    }
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

  const select_data_client = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/client");
      if (response.data.status === 200) {

        setClient(response.data.client);


      }
    } catch (Error) {

    }


  }
  const handleInputChange = (event) => {
    const value = event.target.value;
    // Use a regular expression to allow only numbers (including negative numbers)
    const regex = /^-?\d*$/;
    if (regex.test(value)) {
      setnumFacture(value);
    }
  };

  const handleInputMontant = async (value) => {
    try {
      setSelectedDropdownTarif(value)

      const response = await axios.get(URL_AXIOS + `/list_grille_by_id_pro/${selectedDropdownTarif.ID_Tarif}`);
      setMontant(response.data.montant);
    } catch (Error) {

    }

  }
  /*const select_data_liste_grille = async () => {
    try {
      const response = await axios.get(URL_AXIOS + "/liste_tarif");
      if (response.data.status === 200) {

        setTarif(response.data.tarif);


      }
    } catch (Error) {

    }


  }*/
  useEffect(() => {
    select_data_client();
    select_data_liste_grille();
    select_data_vente();
    getTotalVente();
    select_data_vente_proforma();
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

      <Dialog header="Nouvelle facture proforma" visible={visible} style={{ width: '60vw' }} onHide={() => setVisible(false)}>
        <form>
          <div className='form-group'>
            <input type='text' value={numFacture} onChange={(e) => setnumFacture(e.target.value)} placeholder='Numéro * ' className='form-control ' style={{ width: 100 }} />
          </div>
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
            <Dropdown value={selectedDropdownTarif} onChange={(e) => handleInputMontant(e.value)} options={tarif} optionLabel="libelletarif" placeholder="Selectionner un client"
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
              name='montant' value={montant} onChange={(e) => setMontant(e.target.value)} />
            <label className='mt-2 ml-2'>Quantité *:</label>
            <input type='number' value={quantite} onChange={(e) => setQuantite(e.target.value)} className='form-control col-md-2 ml-3' placeholder='Quantité' />
            <label className='mt-2 ml-2'>P.T *:</label>

            <input type='number' name='reste' value={montant * quantite} onChange={(e) => setReste(e.target.value)} className='form-control col-md-2 ml-3' placeholder='Net à payer' />
          </div>
          <div className='form-group'>
            <textarea rows={5} className='form-control' placeholder='Observation' name='observation' value={observation} onChange={(e) => setObservation(e.target.value)} >

            </textarea>
          </div>
          <div className='form-group d-flex'>
            <button className='btn btn-info text-light' type='button' onClick={() => addVente()}>Enregistrer</button>
            <button className='btn btn-danger ml-2' type='button'>Annuler</button>

          </div>

        </form>
      </Dialog>
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
          <Toast ref={toast} />
          <ConfirmDialog />
          <ConfirmDialog visible={visiblen} onHide={() => setVisiblen(false)} message="Voulez-vous confimer cette facture ?"
            header="Confirmation" icon="pi pi-exclamation-triangle" accept={() => convert_FP_TO_F()} reject={reject} />
          {loading ? <div className='text-center'> <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" /></div> :
            <div className='container-fluid'>
              <div className='row'>

                <div className='container-fluid'>

                  {status_btn ? <button type='button' className='btn btn-success ml-1 text-light' onClick={() => setVisible(true)}>Proforma</button> : ''}
                  <button type='button' onClick={() => visualize_before_print()} className='btn btn-primary text-light ml-1' >Imprimer facture</button>
                  <button type='button' className='btn btn-info ml-1 text-light' style={{ display: 'none' }} onClick={() => navigate('/print_facture')} >Imprimer la liste</button>
                  {status_btn === false ? <button type='button' className='btn btn-warning ml-1 text-light' onClick={() => setVisiblem(true)} disabled={selectedVente.status_vente_fact === "F" ? false : true}>clôture ventes retardées</button> : ''}
                  {status_btn ? <button type='button' className='btn btn-warning text-light' onClick={() => setVisiblen(true)} style={{ marginLeft: 5 }}>Valider la facture</button> : ''}
                  <div className="card mt-3">
                    <TabView onTabChange={handleTabChange} activeIndex={activeIndex}>
                      <TabPanel header="Liste factures" >
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

                          <Column field="status_vente" header="status" body={statusBodyTemplate} className='text-center' />
                          <Column field="created_at" header="Date" className='text-center' />
                          <Column field="nom" header="Opérateur" />

                        </DataTable>
                      </TabPanel>

                      <TabPanel header="Liste factures proforma" >
                        <DataTable ref={dt} value={proforma} paginator rows={20}
                          dataKey="ID_Vente"
                          selectionMode="single" size='small'
                          selection={selectedVentepro} onSelectionChange={(e) => setSelectedVentepro(e.value)}
                          header={header_proforma} globalFilter={globalFilter}
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
                          <Column field="created_at" header="Date" className='text-center' />
                          <Column field="nom" header="Opérateur" />
                          <Column header="Actions" body={actionBodyTemplate} />
                        </DataTable>
                      </TabPanel>

                    </TabView>
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

export default Facturation;