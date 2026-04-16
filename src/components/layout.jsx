import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import './layout.css';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase';
import logo from '/berry_logo.svg';
import { Typography, Button } from '@mui/material';
import {forestGreen, slate, gold, coral, mintGreen, cream} from "./shared-theme/themePrimitives";

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
                    <RouterLink to="/" className="header_logo-link" aria-label="Go to home page">
                        <div className="header_logo">
                            <img src={logo} alt="logo" />
                        </div>
                    </RouterLink>

                    <MuiLink
                        component={RouterLink}
                        to="/list"
                        sx={{
                            fontFamily: '"Meow Script", "Meow Script_R", cursive',
                            color: forestGreen[500],
                            fontSize: { xs: '2rem', md: '2rem' },
                            textDecoration: 'none',
                            '&:hover': {
                                color: mintGreen[700],
                            }
                        }}
                        className="list-button"
                    >
                        List
                    </MuiLink>

                    <MuiLink
                        component={RouterLink}
                        to="/store"
                        sx={{
                            fontFamily: '"Meow Script", "Meow Script_R", cursive',
                            color: forestGreen[500],
                            fontSize: { xs: '2rem', md: '2rem' },
                            textDecoration: 'none',
                            '&:hover': {
                                color: mintGreen[700],
                            }
                        }}
                        className="budget_store_button"
                    >
                        Store
                    </MuiLink>

                    <MuiLink
                        component={RouterLink}
                        to="/Cart"
                        sx={{
                            fontFamily: '"Meow Script", "Meow Script_R", cursive',
                            color: forestGreen[500],
                            fontSize: { xs: '2rem', md: '2rem' },
                            textDecoration: 'none',
                            '&:hover': {
                                color: mintGreen[700],
                            }
                        }}
                        className="budget_store_button"
                    >
                        Cart
                    </MuiLink>

                    {user ? (
                        <>
                            <Typography sx={{
                                fontFamily: '"Meow Script", "Meow Script_R", cursive',
                                color: forestGreen[500],
                                fontSize: '2rem',
                            }}>
                                Hello, {user.displayName || user.email}
                            </Typography>
                            <Button
                                onClick={handleLogout}
                                sx={{
                                    fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                    color: `${forestGreen[500]} !important`,
                                    fontSize: { xs: '1.5rem', md: '1.5rem' },
                                    textDecoration: 'none',
                                    '&:hover': {
                                        color: mintGreen[700],
                                    }
                                }}

                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <MuiLink sx={{
                                fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                color: forestGreen[500],
                                fontSize: { xs: '2rem', md: '2rem' },
                                textDecoration: 'none',
                                '&:hover': {
                                    color: mintGreen[700],
                                }
                            }} component={RouterLink}
                                     to="/signup"
                                     className="list-button"
                            >Sign Up</MuiLink>
                            <MuiLink sx={{
                                fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                color: forestGreen[500],
                                fontSize: { xs: '2rem', md: '2rem' },
                                textDecoration: 'none',
                                '&:hover': {
                                    color: mintGreen[700],
                                }
                            }} component={RouterLink}
                                     to="/signin"
                                     className="list-button"
                            >Sign In</MuiLink>
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