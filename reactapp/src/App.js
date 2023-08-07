import './App.css';
import Content from './component/Content';
import Header from './component/Header';
import Login from './component/Login';
import Preloader from './component/Preloader';
import SidebarLeft from './component/SidebarLeft';
import {BrowserRouter as Router,Route,Switch,Routes} from 'react-router-dom';
import Vente from './component/Vente';
import Client from './component/Client';
import Fonction from './component/Fonction';
import Dashboard from './component/Dashboard';
import AddVente from './component/AddVente';
import Grille from './component/Grille';
import Depense from './component/Depense';
import Historique from './component/HistoriqueVente';
import Caisse from './component/Caisse';
import Employe from './component/Employe';
import Facture from './component/Facture';
import Facturation from './component/Facturation';
import Statistique from './component/Statistique';
import PrintListeFacture from './etats/PrintListeFacture';
import HistoriqueClient from './component/HistoriqueClient';
function App() {
  return (
   
   
      <Router>
    <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/accueil" element={<Dashboard />} />
       
        <Route exact path="/vente" element={<Vente />} />
        <Route exact path="/client" element={<Client />} />
        <Route exact path="/client/:id" element={<Client />} />
        <Route exact path="/fonction" element={<Fonction />} />
        <Route exact path="/historique" element={<Historique />} />
        <Route exact path="/grille" element={<Grille />} />
        <Route exact path="/depense" element={<Depense />} />
        <Route exact path="/caisse" element={<Caisse />} />
        <Route exact path="/employe" element={<Employe />} />
        <Route exact path="/facture/:id" element={<Facture />} />
        <Route exact path="/updatevente/:id" element={<AddVente />} />
        <Route exact path="/facturation" element={<Facturation />} />
        <Route exact path="/statistique" element={<Statistique />} />
        <Route exact path="/print_facture" element={<PrintListeFacture />} />
        <Route exact path="/historique_client/:id" element={<HistoriqueClient />} />
    </Routes>
    </Router>
  
  );
}

export default App;
