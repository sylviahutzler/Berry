import { Routes, Route, Link } from 'react-router-dom';
import Layout from './components/layout';
import Home from './pages/home';
import List from './pages/CreateList';
import Store from "./pages/StoreShop";
import SignUp from "./components/sign-up/SignUp";
import SignIn from "./components/sign-in/SignIn";
import Cart from "./pages/Cart";
import InStoreShopping from "./pages/InStoreShopping";


function App() {
    //Defines which page shoes for each URL
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/list" element={<List />} />
                <Route path="/store" element={<Store />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/in-store-shopping" element={<InStoreShopping />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin"  element={<SignIn />}/>
            </Routes>
        </Layout>
    );
}

export default App;