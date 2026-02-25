import { Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/home';
import List from './pages/list/CreateList';
import Budget from './pages/budget/BudgetHome';
import Store from './pages/store/FromStore';
import StoreShop from "./pages/store/StoreShop";


function App() {
    //Defines which page shoes for each URL
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/list" element={<List />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/store" element={<Store />} />
                <Route path="/store/:storeName" element={<StoreShop />} />
            </Routes>
        </Layout>
    );
}

export default App;