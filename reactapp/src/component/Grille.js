import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { toast } from 'react-toastify';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { URL_AXIOS } from '../data/AxiosUrl';
import { ProgressSpinner } from 'primereact/progressspinner';
function Grille() {
    const navigate = useNavigate();
    const roleuser = sessionStorage.getItem('Role');
    const value_session = sessionStorage.getItem('employe');
    const ID_Employe_value = sessionStorage.getItem('ID_Employe');
    const [visible, setVisible] = useState(false);
    const [visibleConfig, setVisibleConfig] = useState(false);
    const [visiblemo, setVisiblemo] = useState(false);
    const [libelletarif, setLibelletarif] = useState("");
    const [montant, setMontant] = useState("");
    const [ID_Employe, setID_Employe] = useState(ID_Employe_value);
    const toast = useRef(null);
    const [tarif, setTarif] = useState([]);
    const [selectedTarif, setSelectedTarif] = useState([]);
    const [globalFilter, setGlobalFilter] = useState();
    const [loading, setloading] = useState(true);
    const logout = () => {
        sessionStorage.removeItem("ID_Employe");
        sessionStorage.removeItem("employe");
        navigate('/');
    }

    const deletegrille = async (id) => {
        try {
            const response = await axios.post(URL_AXIOS + `/delete_tarif/${id}`);
            if (response.data.status === 200) {
                select_data_liste_grille();
                setVisiblemo(false);
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

    const addGrille = async () => {

        const response = await axios.post(URL_AXIOS + '/tarif', {
            libelletarif: libelletarif,
            montant: montant,
            ID_Employe: ID_Employe
        });
        if (response.data.status === 200) {
            console.log(response.data.message)
            setLibelletarif("");
            setMontant("");
            showSuccess();
            select_data_liste_grille();
        } else {
            showError()
        }
    }
    const updateGrille = async (id) => {

        const response = await axios.post(URL_AXIOS + `/update_tarif/${id}`, {
            libelletarif: libelletarif,
            montant: montant,
            ID_Employe: ID_Employe
        });
        if (response.data.status === 200) {
            console.log(response.data.message)
            setLibelletarif("");
            setMontant("");
            showSuccess();
            select_data_liste_grille();
            setVisibleConfig(false);
        } else {
            showError()
        }
    }
    const exportCSV = () => {
        DataTable.exportCSV();
    }

    const select_data_liste_grille = async () => {
        const response = await axios.get(URL_AXIOS + "/liste_tarif");
    
            setTarif(response.data);

    }
    const editGrille = () => {
        setLibelletarif(selectedTarif.libelletarif);
        setMontant(selectedTarif.montant);
        setVisibleConfig(true);
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2 " style={{ width: '40px', height: '40px' }}
                    onClick={() => editGrille()} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning ml-2 b_edit_sup" style={{ width: '40px', height: '40px' }}
                    onClick={() => setVisiblemo(true)} />
            </React.Fragment>
        );
    }
    const header = (
        <div className="table-header">
            <span className="p-input-icon-left mt-0">
                <i className="pi pi-search mt-1" />
                <InputText type="search" className="txt_search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Recherche..." />
            </span>

        </div>
    );
    const renderFooter = () => {
        return (
            <div>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setVisiblemo(false)} />
                <Button label="Yes" icon="pi pi-check" autoFocus onClick={() => deletegrille(selectedTarif.ID_Tarif)} />
            </div>
        );
    }
    useEffect(() => {

        select_data_liste_grille();
        setTimeout(() => {
            setloading(false)
        }, 1000)
        if (ID_Employe_value === null) {
            navigate('/')
        }
    }, []);


    return (

        <div id="wrapper">
            <Dialog header="Confirmation" visible={visiblemo} modal style={{ width: '350px' }} footer={renderFooter('visiblemo')} onHide={() => setVisiblemo(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span className='ml-2'>Voulez fermer la vente ?</span>
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

                    <Dialog header="Nouveau article" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                        <form>
                            <div className='form-group'>
                                <input type='text' value={libelletarif} onChange={(e) => setLibelletarif(e.target.value)} className="form-control" placeholder="Veuillez saisir le type d'action" />
                            </div>
                            <div className='form-group'>
                                <input type='number' value={montant} onChange={(e) => setMontant(e.target.value)} className="form-control" placeholder="Veuillez saisir le montant" />
                                <input type='hidden' value={ID_Employe} onChange={(e) => setID_Employe(e.target.value)} className="form-control" placeholder="Veuillez saisir le montant" />
                            </div>
                            <div className='form-group'>

                                <button type="button" class="btn btn-primary" onClick={() => addGrille()}>Ajouter</button>
                            </div>
                        </form>
                    </Dialog>
                    <Dialog header="Modification article" visible={visibleConfig} style={{ width: '50vw' }} onHide={() => setVisibleConfig(false)}>
                        <form>
                            <div className='form-group'>
                                <input type='text' value={libelletarif} onChange={(e) => setLibelletarif(e.target.value)} className="form-control" placeholder="Veuillez saisir le type d'action" />
                            </div>
                            <div className='form-group'>
                                <input type='number' value={montant} onChange={(e) => setMontant(e.target.value)} className="form-control" placeholder="Veuillez saisir le montant" />
                                <input type='hidden' value={ID_Employe} onChange={(e) => setID_Employe(e.target.value)} className="form-control" placeholder="Veuillez saisir le montant" />
                            </div>
                            <div className='form-group'>

                                <button type="button" class="btn btn-primary" onClick={() => updateGrille(selectedTarif.ID_Tarif)}>Ajouter</button>
                            </div>
                        </form>
                    </Dialog>
                    {loading ? <div className='text-center'> <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" /></div> :
                        <div className='container-fluid'>
                            <div className='row'>

                                <div className='col col-md-4'>
                                    <button className="btn btn-success f-right" onClick={() => setVisible(true)}>Nouveau</button>
                                </div>
                            </div>
                            <div class="card shadow mb-4 mt-2">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary">Grille tarifaire</h6>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <div className="datatable-filter-demo">
                                            <div className="card">
                                                <DataTable value={tarif} paginator rows={10}
                                                    selectionMode="single" size='small'
                                                    selection={selectedTarif} onSelectionChange={(e) => setSelectedTarif(e.value)}
                                                    header={header} globalFilter={globalFilter}
                                                    className="p-datatable-customers"
                                                    emptyMessage="pas de données." >
                                                    <Column field="ID_Tarif" header="#" />
                                                    <Column field="libelletarif" header="Libellé" />
                                                    <Column field="montant" header="Montant" />
                                                    <Column field="created_at" header="Date" />
                                                    <Column field="nom" header="Opérateur" />
                                                    <Column header="Options" body={actionBodyTemplate} />
                                                </DataTable>
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

export default Grille;