import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { ref, get, set, push, update, remove } from 'firebase/database';
import { Link as RouterLink } from 'react-router-dom';

import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const auth = getAuth();
const database = getDatabase();

export default function Cart() {
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [budget, setBudget] = useState(null);
    const [budgetInput, setBudgetInput] = useState('');
    const [isEditingBudget, setIsEditingBudget] = useState(true);

    function encodeEmail(email) {
        return email.replace(/\./g, '_');
    }

    // Check if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userEmail = encodeEmail(currentUser.email);
                loadCartItems(userEmail);
                loadBudget(userEmail);
            } else {
                setLoading(false);
                setError('Please sign in to view your cart');
            }
        });

        return () => unsubscribe();
    }, []);

    // Load cart items from Firebase Realtime Database
    async function loadCartItems(userEmail) {
        try {
            setError('');
            setLoading(true);

            const cartRef = ref(database, `carts/${userEmail}`);
            const snapshot = await get(cartRef);

            if (snapshot.exists()) {
                const items = snapshot.val();
                // Convert object to array
                const itemsArray = Object.keys(items).map((key) => ({
                    id: key,
                    ...items[key],
                }));
                setCartItems(itemsArray);
            } else {
                setCartItems([]);
            }

            setLoading(false);
        } catch (err) {
            setError('Error loading cart: ' + err.message);
            setLoading(false);
        }
    }

    async function loadBudget(userEmail) {
        try {
            const budgetRef = ref(database, `budgets/${userEmail}`);
            const snapshot = await get(budgetRef);

            if (snapshot.exists() && typeof snapshot.val().amount === 'number') {
                const amount = snapshot.val().amount;
                setBudget(amount);
                setBudgetInput(amount.toString());
                setIsEditingBudget(false);
            } else {
                setBudget(null);
                setBudgetInput('');
                setIsEditingBudget(true);
            }
        } catch (err) {
            setError('Error loading budget: ' + err.message);
        }
    }

    async function saveBudget() {
        if (!user) return;

        const parsedBudget = Number(budgetInput);
        if (Number.isNaN(parsedBudget) || parsedBudget < 0) {
            setError('Please enter a valid budget amount');
            return;
        }

        try {
            setError('');
            const userEmail = encodeEmail(user.email);
            await set(ref(database, `budgets/${userEmail}`), {
                amount: parsedBudget,
                updatedAt: new Date().toISOString(),
            });
            setBudget(parsedBudget);
            setIsEditingBudget(false);
            setSuccess('Budget updated');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Error saving budget: ' + err.message);
        }
    }

    // Add item to cart
    async function addToCart(product) {
        if (!user) {
            setError('Please sign in to add items to cart');
            return;
        }

        try {
            setError('');
            const cartRef = ref(database, `carts/${encodeEmail(user.email)}`);

            // Check if product already exists in cart
            const snapshot = await get(cartRef);
            let found = false;

            if (snapshot.exists()) {
                const items = snapshot.val();
                for (const key in items) {
                    if (items[key].productId === product.id) {
                        // Update quantity if product exists
                        await update(
                            ref(database, `carts/${encodeEmail(user.email)}/${key}`),
                            { quantity: (items[key].quantity || 1) + 1 }
                        );
                        found = true;
                        break;
                    }
                }
            }

            // Add new item if not found
            if (!found) {
                const newItemRef = push(cartRef);
                await set(newItemRef, {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    store: product.store,
                    category: product.category,
                    quantity: 1,
                    addedAt: new Date().toISOString(),
                });
            }

            setSuccess('Item added to cart!');
            setTimeout(() => setSuccess(''), 3000);
            await loadCartItems(encodeEmail(user.email));
        } catch (err) {
            setError('Error adding to cart: ' + err.message);
        }
    }

    // Update item quantity
    async function updateQuantity(itemId, newQuantity) {
        if (!user) return;

        try {
            if (newQuantity <= 0) {
                // Delete item if quantity is 0
                await removeFromCart(itemId);
            } else {
                await update(
                    ref(database, `carts/${encodeEmail(user.email)}/${itemId}`),
                    { quantity: newQuantity }
                );
                await loadCartItems(encodeEmail(user.email));
            }
        } catch (err) {
            setError('Error updating quantity: ' + err.message);
        }
    }

    // Remove item from cart
    async function removeFromCart(itemId) {
        if (!user) return;

        try {
            await remove(ref(database, `carts/${encodeEmail(user.email)}/${itemId}`));
            await loadCartItems(encodeEmail(user.email));
            setSuccess('Item removed from cart');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Error removing item: ' + err.message);
        }
    }

    // Clear entire cart
    async function clearCart() {
        if (!user) return;

        try {
            await remove(ref(database, `carts/${encodeEmail(user.email)}`));
            await loadCartItems(encodeEmail(user.email));
            setSuccess('Cart cleared');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Error clearing cart: ' + err.message);
        }
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const remainingBudget = budget !== null ? budget - subtotal : null;

    const spendingByCategory = cartItems.reduce((acc, item) => {
        const category = item.category || 'Uncategorized';
        const itemTotal = item.price * item.quantity;
        acc[category] = (acc[category] || 0) + itemTotal;
        return acc;
    }, {});

    const spendingByStore = cartItems.reduce((acc, item) => {
        const store = item.store || 'Unknown Store';
        const itemTotal = item.price * item.quantity;
        acc[store] = (acc[store] || 0) + itemTotal;
        return acc;
    }, {});

    if (!user) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">Please sign in to view your cart</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Shopping Cart
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : cartItems.length === 0 ? (
                <Alert severity="info" sx={{ mt: 3 }}>
                    Your cart is empty. Start shopping!
                </Alert>
            ) : (
                <>
                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell><strong>Product</strong></TableCell>
                                    <TableCell align="right"><strong>Price</strong></TableCell>
                                    <TableCell align="center"><strong>Quantity</strong></TableCell>
                                    <TableCell align="right"><strong>Subtotal</strong></TableCell>
                                    <TableCell align="center"><strong>Action</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                    {item.store} • {item.category}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </Button>
                                                <Typography sx={{ minWidth: '30px', textAlign: 'center' }}>
                                                    {item.quantity}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <AddIcon fontSize="small" />
                                                </Button>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                size="small"
                                                color="error"
                                                variant="text"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Cart Summary */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Button
                                variant="outlined"
                                component={RouterLink}
                                to="/in-store-shopping"
                            >
                                Open In-Person Shopping View
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Order Summary
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography>Subtotal:</Typography>
                                        <Typography>${subtotal.toFixed(2)}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Budget Tracker
                            </Typography>
                            {isEditingBudget ? (
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField
                                        type="number"
                                        size="small"
                                        label="Budget Amount"
                                        value={budgetInput}
                                        onChange={(e) => setBudgetInput(e.target.value)}
                                        inputProps={{ min: 0, step: 0.01 }}
                                        fullWidth
                                    />
                                    <Button variant="contained" onClick={saveBudget}>
                                        Save
                                    </Button>
                                </Box>
                            ) : (
                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setBudgetInput(budget !== null ? budget.toString() : '');
                                            setIsEditingBudget(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Budget:</Typography>
                                <Typography>{budget !== null ? `$${budget.toFixed(2)}` : 'Not set'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography>Money Left:</Typography>
                                <Typography
                                    sx={{
                                        fontWeight: 'bold',
                                        color: remainingBudget !== null && remainingBudget < 0 ? 'error.main' : 'success.main',
                                    }}
                                >
                                    {remainingBudget !== null ? `$${remainingBudget.toFixed(2)}` : 'Set a budget'}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Spending by Category
                                    </Typography>
                                    {Object.keys(spendingByCategory).length === 0 ? (
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            No category spend yet.
                                        </Typography>
                                    ) : (
                                        Object.entries(spendingByCategory).map(([category, amount]) => (
                                            <Box
                                                key={category}
                                                sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}
                                            >
                                                <Typography variant="body2">{category}</Typography>
                                                <Typography variant="body2">${amount.toFixed(2)}</Typography>
                                            </Box>
                                        ))
                                    )}
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        Spending by Store
                                    </Typography>
                                    {Object.keys(spendingByStore).length === 0 ? (
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            No store spend yet.
                                        </Typography>
                                    ) : (
                                        Object.entries(spendingByStore).map(([store, amount]) => (
                                            <Box
                                                key={store}
                                                sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}
                                            >
                                                <Typography variant="body2">{store}</Typography>
                                                <Typography variant="body2">${amount.toFixed(2)}</Typography>
                                            </Box>
                                        ))
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </>
            )}
        </Container>
    );
}