import React, { useEffect, useRef, useState } from 'react';
import Main from './Template';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { URL_AXIOS } from '../data/AxiosUrl';
import { ProgressSpinner } from 'primereact/progressspinner';

function Depense() {

    const navigate = useNavigate();
    const roleuser = sessionStorage.getItem('Role');
    const value_session = sessionStorage.getItem('employe');
    const ID_Employe_value = sessionStorage.getItem('ID_Employe');
    const [globalFilter, setGlobalFilter] = useState();
    const [visible, setVisible] = useState(false);
    const [motif, setMotif] = useState("");
    const [montant, setMontant] = useState(0);
    const [depense, setDepense] = useState([]);
    const [selectedDepense, setSelectedDepense] = useState([]);
    const [visiblem, setVisiblem] = useState(false);
    const [visibleConfi, setVisibleConfi] = useState(false);
    const toast = useRef(null);
    const [loading, setloading] = useState(true);
    const logout = () => {
        sessionStorage.removeItem("ID_Employe");
        sessionStorage.removeItem("employe");
        navigate('/');
    }
    const addDepense = async () => {
        const response = await axios.post(URL_AXIOS + '/save_depense', {
            motif: motif,
            montant: montant,
            ID_Employe: ID_Employe_value
        });
        if (response.data.status === 200) {
            console.log(response.data.message)
            setMontant(0);
            setMotif("");
            select_data_depense();
            showSuccess();
        } else if (response.data.status === 401) {
            showWarn(response.data.error);
        } else if (response.data.status === 400) {
            showWarn(response.data.error2);
        }
    }
    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
          const worksheet = xlsx.utils.json_to_sheet(depense);
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
          });
    
          saveAsExcelFile(excelBuffer, 'Liste des dépenses');
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
    const updateDepense = async (id) => {
        const response = await axios.post(URL_AXIOS + `/depense_update/${id}`, {
            motif: motif,
            montant: montant,
            ID_Employe: ID_Employe_value
        });
        if (response.data.status === 200) {
            console.log(response.data.message)
            setMontant(0);
            setMotif("");
            select_data_depense();
            showSuccess();
            setVisiblem(false)
        }
    }

    const deleteDepense = async (id) => {
        const response = await axios.post(URL_AXIOS + `/depense_delete/${id}`);
        if (response.data.status === 200) {
            console.log(response.data.message)

            select_data_depense();
            showSuccess();
            setVisibleConfi(false)
        }
    }
    const select_data_depense = async () => {
        const response = await axios.get(URL_AXIOS + "/depense");
        if (response.data.status === 200) {

            setDepense(response.data.depense);


        }

    }
    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: "L'enregistrement a été effectué avec succès !", life: 3000 });
    }

    const showInfo = () => {
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
    }

    const showWarn = (message) => {
        toast.current.show({ severity: 'warn', summary: 'Warning', detail: message, life: 3000 });
    }

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Message Content', life: 3000 });
    }
    const ouvre = () => {
        setMotif("");
        setMontant("")
        setVisible(true)

    }
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>

                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2 " style={{ width: '40px', height: '40px' }} onClick={() => editProduct()} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning  b_edit_sup" style={{ width: '40px', height: '40px' }} onClick={() => setVisibleConfi(true)} />

            </React.Fragment>
        );
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setVisibleConfi(false)} />
                <Button label="Yes" icon="pi pi-check" autoFocus onClick={() => deleteDepense(selectedDepense.ID_Depense)} />
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
    const formate_number = (data) => {
        return <p>{new Intl.NumberFormat().format(data.montant)}</p>
    }
    const editProduct = () => {

        setMotif(selectedDepense.motif);
        setMontant(selectedDepense.montant);
        setVisiblem(true)

    }
    useEffect(() => {
        select_data_depense();
        if (ID_Employe_value === null) {
            Navigate('/')
        }
        setTimeout(() => {
            setloading(false)
        }, 1000)
    }, []);
    return (
        <div id="wrapper">

            <Toast ref={toast} />
            <Dialog header="Confirmation" visible={visibleConfi} modal style={{ width: '350px' }} footer={renderFooter('visiblem')} onHide={() => setVisibleConfi(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span className='ml-2'>Voulez fermer supprimer cette depense ?</span>
                </div>
            </Dialog>
            <Dialog header="Nouvelle dépense" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <form>



                    <div className='form-group'>
                        <input type="text" placeholder='Saisissez le modif' value={motif} onChange={(e) => setMotif(e.target.value)} className='form-control' />
                        <input type="hidden" value={ID_Employe_value} placeholder='Saisissez nom client' className='form-control' />
                    </div>
                    <div className='form-group'>

                        <input type="text" placeholder='Saisissez le montant' value={montant} onChange={(e) => setMontant(e.target.value)} className='form-control' />
                    </div>
                    <div className='form-group'>

                        <button type="button" class="btn btn-primary" onClick={() => addDepense()}>Ajouter</button>
                    </div>

                </form>
            </Dialog>
            <Dialog header="Modification dépense" visible={visiblem} style={{ width: '50vw' }} onHide={() => setVisiblem(false)}>
                <form>



                    <div className='form-group'>
                        <input type="text" placeholder='Saisissez le modif' value={motif} onChange={(e) => setMotif(e.target.value)} className='form-control' />
                        <input type="hidden" value={ID_Employe_value} placeholder='Saisissez nom client' className='form-control' />
                    </div>
                    <div className='form-group'>

                        <input type="text" placeholder='Saisissez le montant' value={montant} onChange={(e) => setMontant(e.target.value)} className='form-control' />
                    </div>
                    <div className='form-group'>

                        <button type="button" class="btn btn-primary" onClick={() => updateDepense(selectedDepense.ID_Depense)}>Modifier</button>
                    </div>

                </form>
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
                                <a class="nav-link"  onClick={() => logout()}>
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

                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3"
                                        onClick={() => ouvre()}>
                                        Nouveau
                                    </button>
                                    <Button type='button' label='Exporter' onClick={()=>exportExcel()} icon="pi pi-file-excel"   style={{ height: '37px', width: '130px',marginLeft:10 }} severity="success" />
                                </div>
                            </div>
                            <br />

                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary " >Liste des dépenses</h6>

                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">



                                        <DataTable value={depense} paginator rows={10}

                                            dataKey="ID_Depense"
                                            selectionMode="single" size='small'
                                            selection={selectedDepense} onSelectionChange={(e) => setSelectedDepense(e.value)}
                                            header={header} globalFilter={globalFilter}

                                            className="p-datatable-customers"
                                            emptyMessage="pas de données." >

                                            <Column field="ID_Depense" header="#" />
                                            <Column field="motif" header="motif" />
                                            <Column field="montant" header="montant" body={formate_number} />
                                            <Column field="created_at" header="Date" />
                                            <Column field="nom" header="Opérateur" />
                                            <Column header="Options" body={actionBodyTemplate(selectedDepense.ID_Depense)} />
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
    );
}

export default Depense;