import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL_AXIOS } from '../data/AxiosUrl';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';
function Login() {
    const toast = useRef(null);
    const [blocked, setBlocked] = useState(false);

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Erreur', detail: 'Mot de passe ou nom d\'utilisateur incorrect', life: 3000 });
    }
    const [login, setLogin] = useState("");
    const [motpasse, setMotpasse] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const Login = async () => {
        setBlocked(true)
        const response = await axios.post(URL_AXIOS + '/login', { login: login, motpasse: motpasse });
        if (response.data.status === 200) {
            //console.log(response.data.employe)
            if (response.data.employe.login === login && response.data.employe.motpasse === motpasse) {
                sessionStorage.setItem("employe", response.data.employe.nom + " " + response.data.employe.prenom);
                sessionStorage.setItem("ID_Employe", response.data.employe.ID_Employe);
                sessionStorage.setItem("Role", response.data.employe.rolefonction);
                navigate('/accueil');
            } else {
                console.log("Mot de passe ou nom d'utilisateur incorrect")
            }

        } else if (response.data.status === 500) {
            setLogin("");
            setMotpasse("");
            //setMessage(response.data.message)
            showError();
        }
    }
    useEffect(() => {
        if (blocked) {
            setTimeout(() => {
                setBlocked(false);
            },3000);
        }
    }, [blocked]);
    return (
        <div class="container-fluid "
            style={{ minHeight: '100vh', backgroundColor: '#3b281a', backgroundImage: 'url(../../img/carousel-1.jpg)' }}
        >
            
            <Toast ref={toast} />
            <BlockUI blocked={blocked} fullScreen />
            <div class="row justify-content-center">
                <div class="col-md-4">

                </div>
                <div class="col-md-4">
                    <br />   <br />   <br />   <br />
                    <div class="card o-hidden border-0 mb-5 shadow-lg my-5 cadre"
                        style={{ backgroundColor: '#af7128', borderBottom: '2px solid white', width: '100%' }}>
                        <div class="card-body p-0">
                            <div class="text-center" style={{ marginTop: '20px' }}>

                                <i className="pi pi-user " style={{ fontSize: '2.5rem', backgroundColor: '#fff', padding: '25px', borderRadius: '100%', color: '#af7128', width: '100px', height: '100px' }}></i>
                                <h1 class="h4 text-light mt-3">ROVEN SERVICES PRO</h1>
                            </div>
                            <form class="user mt-3" style={{ padding: 20 }}>
                                <div class="form-group">
                                    <input type="text" class="form-control form-control-user" name='login' value={login} onChange={(e) => setLogin(e.target.value)}
                                        id="exampleInputEmail" aria-describedby="emailHelp"
                                        placeholder="Saisissez votre nom pseudo " required  style={{textAlign:'center'}}/>

                                </div>
                                <div class="form-group">
                                    <input type="password" class="form-control form-control-user" style={{textAlign:'center'}}
                                        id="exampleInputPassword" name='motpasse' value={motpasse} onChange={(e) => setMotpasse(e.target.value)} placeholder="Saisissez votre mot de passe"
                                        required />
                                </div>

                                <a onClick={() => Login()} class="btn btn-default btn-user btn-block text-light" style={{ backgroundColor: '#3b281a',fontWeight:600 }}>
                                    Se connecter
                                </a>


                            </form>
                             
                        </div>
                        <br /><br /><br />
                    </div>

                </div>
                <div class="col-md-4">

                </div>
            </div>

        </div>
    );
}

export default Login;