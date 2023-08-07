import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { URL_AXIOS } from '../data/AxiosUrl';


function Facture() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [vente, setVente] = useState([]);
    const [selectedvente, setSelectedVente] = useState([]);
    const value_session = sessionStorage.getItem('employe');
    const status_retour = sessionStorage.getItem('status_retour');
    const numfact = sessionStorage.getItem('numfact');
    const m = sessionStorage.getItem('m');
    const status = sessionStorage.getItem('status');
    const ID_Employe_value = sessionStorage.getItem('ID_Employe');
    const [total, setTotal] = useState(0);

    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const Print = () => {
        //console.log('print');  
        let printContents = document.getElementById('printablediv').innerHTML;
        let originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;

    }
    const select_data_grille_by_id_load = async (id) => {
        try {
            const response = await axios.get(URL_AXIOS + `/vente_list_print/${m}/${id}/${status}/${numfact}`);
            if (response.data.status === 200) {

                setVente(response.data.vente);
                //console.log("Database date " + response.data.actions + " " + m)

            }
        } catch (Error) {

        }


    }
    const select_data_grille_by_id_load_by_first = async (id) => {
        try {
            const response = await axios.get(URL_AXIOS + `/vente_list_print_first/${m}/${id}/${status}/${numfact}`);
            if (response.data.status === 200) {

                setSelectedVente(response.data.vente);
                setTotal(response.data.total);


            }
        } catch (Error) {
            console.log(Error.Error)
        }


    }
    const back = () => {
        if (status_retour === "H") {
            sessionStorage.removeItem("H");
            sessionStorage.removeItem("m");
            sessionStorage.removeItem("numfact");
            navigate('/facturation')

        } else if (status_retour === "V") {
            sessionStorage.removeItem("V");
            sessionStorage.removeItem("H");
            sessionStorage.removeItem("m");
            sessionStorage.removeItem("numfact");
            navigate('/vente');
        }
    }
    useEffect(() => {
        if (id === 'undefined') {
            navigate('/vente')
        } else {
            select_data_grille_by_id_load(id);
            select_data_grille_by_id_load_by_first(id);
        
        }

    }, []);
    return (
        <div className="Facture">
            <div className="d-flex justify-content-center text-center mt-4">
                <button type='button' onClick={() => handlePrint()} className='btn btn-warning mt-1 text-light text-center  pi pi-print '></button>
                <button type='button' onClick={() => back()} className='btn btn-success mt-1 ml-1 text-light text-center pi pi-backward '></button>
            </div>
            <div class="book" id='printablediv' ref={componentRef}>

                <div class="page" >
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col col-md-8'>

                                <img src={'../../logo_modified.png'} style={{ width: '150px', height: '100px', marginTop: '-2px' }} /><br />
                                <h6 className="text-center" style={{ marginLeft: '-80px' }}>RO.SE.PRO<br />Menuiserie moderne</h6><br />
                                <h6 className='fw-bold' style={{ fontSize: '12px' }}><span className='fw-bold' style={{ fontSize: '12px' }}>Pays      :</span>République du Congo</h6>
                                <h6 className='fw-bold' style={{ fontSize: '12px' }}><span className='fw-bold' style={{ fontSize: '12px' }}>Ville     :</span>Pointe-Noire</h6>
                                <h6 className='fw-bold' style={{ fontSize: '12px' }}><span className='fw-bold' style={{ fontSize: '12px' }}>Adresse   :</span> Tié-tié 7/7 de Dany</h6>
                                <h6 className='fw-bold' style={{ fontSize: '12px' }}><span className='fw-bold' style={{ fontSize: '12px' }}>Téléphone :</span> (+242) 06 719 03 03</h6>
                                <h6 className='fw-bold' style={{ fontSize: '12px' }}><span className='fw-bold' style={{ fontSize: '12px' }}>E-mail :</span>atelier@rovenservicespro.com</h6>
                                <h6 className='fw-bold' style={{ fontSize: '12px' }}><span className='fw-bold' style={{ fontSize: '12px' }}>Horaire   :</span>  Ouvert du Lundi au vendredi de 8h à 17h et samedi de 8h à 14h</h6>
                            </div>
                            <div className='col col-md-4'>
                                <div className='group_facture'>
                                    <h6 className='fw-bold' style={{ fontSize: '12px' }}> FACTURE {status === "FP" ? "PROFORMA" : ""} N° :</h6><h6 className='fw-bold' style={{ fontSize: '12px' }}> {selectedvente !== null ? selectedvente.actions : ""}</h6>
                                    <h6 className='fw-bold' style={{ fontSize: '12px' }}>Date :</h6><h6 className='fw-bold' style={{ fontSize: '12px' }}>{selectedvente !== null ? selectedvente.created_at : ""}</h6>
                                    <h6 className='fw-bold' style={{ fontSize: '12px' }}>Opérateur :</h6><h6 className='fw-bold' style={{ fontSize: '12px' }}>{value_session}</h6>
                                </div>
                                <div className='group_client'>
                                    <h6 className='fw-blod' style={{ fontSize: '12px' }}><span className='fw-bold' style={{ fontSize: '12px' }}>Nom du client :<br /> </span>{selectedvente !== null ? selectedvente.nomclient : ""}</h6>
                                    <h6 className='fw-blod' style={{ fontSize: '12px' }}><span className='fw-bold' style={{ fontSize: '12px' }}>Téléphone: </span>{selectedvente !== null ? selectedvente.telephoneclient : ""}</h6>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='fw-bold' >
                                <table className='table table-bordered'>
                                    <tr className='bg-warning' style={{ fontSize: '12px' }}>
                                        <th className="text-center">#</th>
                                        <th>DESIGNATION</th>
                                        <th className="text-center">P.U</th>
                                        <th className="text-center">Q.T</th>
                                        <th className="text-center">P.T</th>
                                    </tr>
                                    {vente.map((v, index) => (
                                        <tr key={v.ID_Vente} style={{ fontSize: '12px' }}>
                                            <th className="text-center">{index + 1}</th>
                                            <td className="fw-bold">{v.libelletarif}</td>
                                            <td className="text-center fw-bold">{new Intl.NumberFormat().format(v.montant)}</td>
                                            <td className="text-center fw-bold">{new Intl.NumberFormat().format(v.avance)}</td>
                                            <td className="text-center fw-bold">{new Intl.NumberFormat().format(v.reste)}</td>

                                        </tr>
                                    ))}
                                    <tr style={{ fontSize: '12px' }}>
                                        <th colspan="4">Total </th>


                                        <th className="text-center">{new Intl.NumberFormat().format(total)}</th>
                                    </tr>

                                </table>
                                
                            </div>
                            
                        </div>
                        {status === "FP" ? 
                            <div className='row'>
                            <div className='col col-md-4'>
                               <h6>informations bancaires<hr/></h6>
                               <p className='fw-normal fw-bold' style={{ fontSize: '12px' }}>Banque:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BGFI BANK</p>
                               <p className='fw-normal fw-bold' style={{ fontSize: '12px',marginTop:'-16px' }}>N° de compte:&nbsp;30008 03200 32031881011 72</p>
                              
                            </div>
                           </div>
                        : ""}
                    
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Facture;