import React, { useEffect, useState } from 'react';
import { URL_AXIOS } from '../data/AxiosUrl';
import axios from 'axios';

function PrintListeFacture() {
    const [vente, setVente] = useState([]);
    
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

  useEffect(()=>{
    select_data_vente();
  },[])
    return (
        <div>
            <div class="book" id='printablediv' >

                <div class="pageA4" >
                    <div className='container-fluid'>
                        <div className="row">
                            <div className='col col-md-12'>
                            <img src={'../../logo.png'} style={{ width: '200px', height: '150px',marginLeft:-30,float:'left' }} /><br />
                            <h1>ROVEN SERVICES PRO</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div style={{border:'2px solid black',height:50,marginTop:40,display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                                <h5>LISTE DE VENTE</h5>
                            </div>
                        </div>
                        <div className="row">
                           <table border="2" style={{marginTop:20}} class="table">
                              <tr style={{fontSize:12}}>
                                <th>#</th>
                                <th>N° facture</th>
                                <th>Client</th>
                                <th>Actions</th>
                                <th>Date</th>
                                <th>P.U</th>
                                <th>QTE</th>
                                <th>P.T</th>
                              </tr>
                              {vente.map((v,index)=>(
                                  <tr style={{fontSize:12}}>
                                  <th>{index}</th>
                                  <th>{v.actions}</th>
                                  <th>{v.nomclient}</th>
                                  <th>{v.libelletarif}</th>
                                  <th>{v.created_at}</th>
                                  <th>{v.montant}</th>
                                  <th>{v.quantite}</th>
                                  <th>{v.reste}</th>
                                </tr>
                                ))}
                           </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrintListeFacture;