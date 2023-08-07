import axios from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { URL_AXIOS } from '../data/AxiosUrl';
import { ProgressSpinner } from 'primereact/progressspinner';

function Fonction() {
    const roleuser = sessionStorage.getItem('Role');
    const navigate = useNavigate();
    const [libelle, setLibelle] = useState("");
    const [role, setRole] = useState("");
    const value_session = sessionStorage.getItem('employe');
    const ID_Employe_value = sessionStorage.getItem('ID_Employe');
    const [globalFilter, setGlobalFilter] = useState();
    const [visiblem, setVisiblem] = useState(false);
    const [visibleConfi, setVisibleConfi] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedFonction, setSelectedFonction] = useState([]);
    const [fonction, setFonction] = useState([]);
    const toast = useRef(null);
    const [loading, setloading] = useState(true);
    const logout = () => {
        sessionStorage.removeItem("ID_Employe");
        sessionStorage.removeItem("employe");
        navigate('/');
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

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>

                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2 " style={{ width: '40px', height: '40px' }} onClick={() => editProduct()} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning ml-2 b_edit_sup" style={{ width: '40px', height: '40px' }} onClick={() => setVisibleConfi(true)} />

            </React.Fragment>
        );
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setVisibleConfi(false)} />
                <Button label="Yes" icon="pi pi-check" autoFocus onClick={() => deleteFonction(selectedFonction.ID_Fonction)} />
            </div>
        );
    }
    const editProduct = () => {

        setLibelle(selectedFonction.nomfonction);
        setRole(selectedFonction.rolefonction);
        setVisiblem(true)

    }

    const addFonction = async () => {
        const response = await axios.post(URL_AXIOS + '/store_fonction', {
            nomfonction: libelle,
            rolefonction: role
        });
        if (response.data.status === 200) {
            console.log(response.data.message)
            setLibelle("");
            setRole("");
            select_data_fonction();
            showSuccess();
        } else {

        }
    }

    const updateFonction = async (id) => {
        const response = await axios.post(URL_AXIOS + `/edit_fonction/${id}`, {
            nomfonction: libelle,
            rolefonction: role
        });
        if (response.data.status === 200) {
            console.log(response.data.message)
            setLibelle("");
            setRole("");
            select_data_fonction();
            showSuccess();
            setVisiblem(false)
        }
    }

    const deleteFonction = async (id) => {
        const response = await axios.post(URL_AXIOS + `/delete_fonction/${id}`);
        if (response.data.status === 200) {
            console.log(response.data.message)
            select_data_fonction();
            showSuccess();
            setVisibleConfi(false)
        }
    }
    const select_data_fonction = async () => {
        const response = await axios.get(URL_AXIOS + "/liste_fonction");
        if (response.data.status === 200) {

            setFonction(response.data.fonction);


        }

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
        select_data_fonction();
        setTimeout(() => {
            setloading(false)
        }, 1000);
        if (ID_Employe_value === null) {
            Navigate('/')
        }
    }, []);
    return (
        <div id="wrapper">
            <Toast ref={toast} />
            <Dialog header="Confirmation" visible={visibleConfi} modal style={{ width: '350px' }} footer={renderFooter('visiblem')} onHide={() => setVisibleConfi(false)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                    <span className='ml-2'>Voulez fermer supprimer cette fonction ?</span>
                </div>
            </Dialog>
            <Dialog header="Nouvelle Fonction" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <form>



                    <div className='form-group'>
                        <input type="text" placeholder='Saisissez le modif' value={libelle} onChange={(e) => setLibelle(e.target.value)} className='form-control' />
                        <input type="hidden" value={ID_Employe_value} placeholder='Saisissez nom client' className='form-control' />
                    </div>
                    <div className='form-group'>

                        <input type="text" placeholder='Saisissez le montant' value={role} onChange={(e) => setRole(e.target.value)} className='form-control' />
                    </div>
                    <div className='form-group'>

                        <button type="button" class="btn btn-primary" onClick={() => addFonction()}>Ajouter</button>
                    </div>

                </form>
            </Dialog>
            <Dialog header="Modification Fonction" visible={visiblem} style={{ width: '50vw' }} onHide={() => setVisiblem(false)}>
                <form>



                    <div className='form-group'>
                        <input type="text" placeholder='Saisissez le modif' value={libelle} onChange={(e) => setLibelle(e.target.value)} className='form-control' />
                        <input type="hidden" value={ID_Employe_value} placeholder='Saisissez nom client' className='form-control' />
                    </div>
                    <div className='form-group'>

                        <input type="text" placeholder='Saisissez le montant' value={role} onChange={(e) => setRole(e.target.value)} className='form-control' />
                    </div>
                    <div className='form-group'>

                        <button type="button" class="btn btn-primary" onClick={() => updateFonction(selectedFonction.ID_Fonction)}>Ajouter</button>
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

                                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3" onClick={() => setVisible(true)}>
                                        Nouveau
                                    </button>
                                </div>
                            </div>
                            <br />
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 font-weight-bold text-primary " >Liste des Fonctions</h6>

                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">



                                        <DataTable value={fonction} paginator rows={10}

                                            dataKey="ID_Fonction"
                                            selectionMode="single" size='small'

                                            selection={selectedFonction} onSelectionChange={(e) => setSelectedFonction(e.value)}
                                            header={header} globalFilter={globalFilter}
                                            className="p-datatable-customers"
                                            emptyMessage="pas de données." >

                                            <Column field="ID_Fonction" header="#" />
                                            <Column field="nomfonction" header="Libellé" />
                                            <Column field="rolefonction" header="Rôle" />
                                            <Column header="Options" body={actionBodyTemplate(selectedFonction.ID_Fonction)} />
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

export default Fonction;