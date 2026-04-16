import React, { useEffect, useMemo, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';
import {
    Container,
    Typography,
    Alert,
    CircularProgress,
    Box,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import { forestGreen, slate, gold, coral, mintGreen, cream } from '../components/shared-theme/themePrimitives';

const auth = getAuth();
const database = getDatabase();

export default function InStoreShopping() {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    function encodeEmail(email) {
        return email.replace(/\./g, '_');
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                loadCart(encodeEmail(currentUser.email));
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    async function loadCart(userEmail) {
        try {
            setError('');
            setLoading(true);
            const cartRef = ref(database, `carts/${userEmail}`);
            const snapshot = await get(cartRef);

            if (!snapshot.exists()) {
                setCartItems([]);
                setLoading(false);
                return;
            }

            const itemsObj = snapshot.val();
            const itemsArray = Object.keys(itemsObj).map((key) => ({
                id: key,
                ...itemsObj[key],
            }));
            setCartItems(itemsArray);
            setLoading(false);
        } catch (err) {
            setError('Error loading in-store list: ' + err.message);
            setLoading(false);
        }
    }

    const groupedItems = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const store = item.store || 'Unknown Store';
            const location = item.category || 'General';
            if (!acc[store]) {
                acc[store] = {};
            }
            if (!acc[store][location]) {
                acc[store][location] = [];
            }
            acc[store][location].push(item);
            return acc;
        }, {});
    }, [cartItems]);

    if (!user) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="info">Please sign in to view your in-store shopping list.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography sx={{fontFamily: '"Meow Script", "Meow Script_R", cursive', color: forestGreen[500],}} variant="h3" component="h1" gutterBottom>
                In-Person Shopping View
            </Typography>
            <Typography variant="body1" sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                color: forestGreen[500], mb: 3}}>
                Your cart organized by store and aisle/location.
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : cartItems.length === 0 ? (
                <Alert severity="info">Your cart is empty.</Alert>
            ) : (
                Object.entries(groupedItems).map(([store, locations]) => (
                    <Card key={store} sx={{ mb: 3, backgroundColor: cream[500], p: 2 }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ mb: 2, fontFamily: '"Meow Script", "Meow Script_R", cursive', color: forestGreen[500], fontSize: { xs: '2rem', md: '2rem' } }}>
                                {store}
                            </Typography>
                            {Object.entries(locations).map(([location, items], index) => (
                                <Box key={location} sx={{ mb: index < Object.keys(locations).length - 1 ? 2 : 0 }}>
                                    <Typography variant="subtitle1" sx={{  mb: 1, fontFamily: '"Meow Script", "Meow Script_R", cursive', color: forestGreen[500], fontSize: { xs: '1.5rem', md: '1.5rem' } }}>
                                        {location}
                                    </Typography>
                                    {items.map((item) => (
                                        <Box
                                            key={item.id}
                                            sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5,
                                                color: forestGreen[500] }}
                                        >
                                            <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',}} variant="body2">{item.name}</Typography>
                                            <Typography variant="body2" sx={{ fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif', }}>
                                                Qty: {item.quantity || 1}
                                            </Typography>
                                        </Box>
                                    ))}
                                    {index < Object.keys(locations).length - 1 && <Divider sx={{ mt: 1.5 }} />}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
}
