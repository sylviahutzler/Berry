
import { Link } from 'react-router-dom';
import './Layout.css';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase';

function Layout({ children }) {
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };
    return (
        <div>
            <div className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
                <div className="header-content">
                    <Link to="/" className="header_logo-link" aria-label="Go to home page">
                        <div className="header_logo">
                            <img src="/berry_logo.svg" alt="Berry Logo"  />
                        </div>
                    </Link>
                    <Link to="/list" className="list-button">
                        List
                    </Link>
                    <Link to="/store" className="budget_store_button">
                        Store
                    </Link>
                    <Link to="/Cart" className="budget_store_button">
                        Cart
                        <span className="cart-count" id="cartCount">0</span>
                    </Link>
                    {user ? (
                        <>
                    <span className="font-medium">
                        Hello, {user.displayName || user.email}
                    </span>
                            <button
                                onClick={handleLogout}
                                className="font-medium px-3 py-1 rounded-lg transition-colors duration-200 hover:bg-[#8B9D83]"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/signup">Sign Up</Link>
                            <Link to="/signin">Sign In</Link>
                        </>
                    )}
                </div>
            </div>
            <main>
                {children}
            </main>
        </div>
    );
}

export default Layout;