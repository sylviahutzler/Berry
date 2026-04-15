
import React, { useState, useEffect } from 'react';
import { db, auth, database } from '../../firebase';
import { ref, get, set, push, update } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
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
    Divider,
    TextField,
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


export default function StoreProducts() {
    const [user, setUser] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedStore, setSelectedStore] = useState('');
    const [uniqueStores, setUniqueStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [addingToCart, setAddingToCart] = useState(null);
    const [shoppingList, setShoppingList] = useState([]);
    const [budget, setBudget] = useState(null);
    const [budgetInput, setBudgetInput] = useState('');
    const [isEditingBudget, setIsEditingBudget] = useState(true);
    const [cartItems, setCartItems] = useState([]);

    function encodeEmail(email) {
        return email.replace(/\./g, '_');
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userEmail = encodeEmail(currentUser.email);
                loadShoppingList(userEmail);
                loadBudget(userEmail);
                loadCartItems(userEmail);
            } else {
                setShoppingList([]);
                setCartItems([]);
                setBudget(null);
                setBudgetInput('');
                setIsEditingBudget(true);
            }
        });

        return () => unsubscribe();
    }, []);

    // Load products from Firestore
    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            setError('');
            setLoading(true);

            const categories = ['Produce', 'Dairy', 'Bakery', 'Meat', 'Pantry', 'Beverages'];
            const products = [];

            // Query each category collection
            for (const category of categories) {
                const querySnapshot = await getDocs(collection(db, category));

                querySnapshot.forEach((doc) => {
                    products.push({
                        id: doc.id,
                        category: category,  // Add category since it's the collection name
                        ...doc.data()
                    });
                });
            }

            setAllProducts(products);

            // Get unique stores
            const stores = [...new Set(products.map(p => p.store))].sort();
            setUniqueStores(stores);
            setLoading(false);
        } catch (err) {
            setError('Error loading products: ' + err.message);
            setLoading(false);
        }
    }

    async function loadShoppingList(userEmail) {
        try {
            const listRef = ref(database, `shoppingLists/${userEmail}`);
            const snapshot = await get(listRef);
            if (snapshot.exists()) {
                const items = snapshot.val();
                const asArray = Object.keys(items).map((key) => ({
                    id: key,
                    ...items[key],
                }));
                setShoppingList(asArray);
            } else {
                setShoppingList([]);
            }
        } catch (err) {
            setError('Error loading shopping list: ' + err.message);
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

    async function loadCartItems(userEmail) {
        try {
            const cartRef = ref(database, `carts/${userEmail}`);
            const snapshot = await get(cartRef);
            if (snapshot.exists()) {
                const items = snapshot.val();
                const asArray = Object.keys(items).map((key) => ({
                    id: key,
                    ...items[key],
                }));
                setCartItems(asArray);
            } else {
                setCartItems([]);
            }
        } catch (err) {
            setError('Error loading cart: ' + err.message);
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
            setTimeout(() => setSuccess(''), 2000);
        } catch (err) {
            setError('Error saving budget: ' + err.message);
        }
    }

    async function handleAddToCart(product) {
        if (!user) {
            setError('Please sign in to add items to cart');
            return;
        }

        try {
            setError('');
            setAddingToCart(product.id);
            const cartRef = ref(database, `carts/${encodeEmail(user.email)}`);

            // Check if product already exists in cart
            const snapshot = await get(cartRef);
            let found = false;

            if (snapshot.exists()) {
                const items = snapshot.val();
                for (const key in items) {
                    if (items[key].productId === product.id) {
                        // Update quantity if product exists
                        const { update } = await import('firebase/database');
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
                    description: product.description,
                    quantity: 1,
                    addedAt: new Date().toISOString(),
                });
            }

            setSuccess('Item added to cart!');
            setTimeout(() => {
                setSuccess('');
                setAddingToCart(null);
            }, 2000);
            await loadCartItems(encodeEmail(user.email));
        } catch (err) {
            setError('Error adding to cart: ' + err.message);
            setAddingToCart(null);
        }
    }

    // Filter products based on selected store
    const filteredProducts = selectedStore
        ? allProducts.filter(p => p.store === selectedStore)
        : allProducts;

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Find products at a specific store
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} md={8} lg={9}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Select a Store:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                            {uniqueStores.map((store) => (
                                <Button
                                    key={store}
                                    variant={selectedStore === store ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedStore(store)}
                                >
                                    {store}
                                </Button>
                            ))}
                        </Box>

                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {filteredProducts.length} products
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredProducts.map((product) => (
                                <Grid item xs={12} sm={6} xl={4} key={product.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" component="div" gutterBottom>
                                                {product.name}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                Isle: {product.category}
                                            </Typography>
                                            <Typography variant="h6" color="success.main" sx={{ my: 1 }}>
                                                ${product.price.toFixed(2)}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                {product.description}
                                            </Typography>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{
                                                    mt: 2,
                                                    backgroundColor: '#8B9D83',
                                                    '&:hover': { backgroundColor: '#7a8a72' },
                                                }}
                                                startIcon={<ShoppingCartIcon />}
                                                onClick={() => handleAddToCart(product)}
                                                disabled={addingToCart === product.id || !user}
                                            >
                                                {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <Typography variant="body1" sx={{ textAlign: 'center', py: 8 }}>
                            No products found
                        </Typography>
                    )}
                </Grid>

                <Grid item xs={12} md={4} lg={3} sx={{ alignSelf: 'flex-start' }}>
                    <Box
                        sx={{
                            position: { xs: 'static', md: 'fixed' },
                            top: { md: 230 },
                            right: { md: 24 },
                            width: { md: 300, lg: 320 },
                            maxHeight: { md: 'calc(100vh - 250px)' },
                            overflowY: { md: 'auto' },
                            pr: { md: 0.5 },
                        }}
                    >
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Shopping List
                                </Typography>
                                {!user ? (
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Sign in to see your saved list.
                                    </Typography>
                                ) : shoppingList.length === 0 ? (
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        No list items yet. Add items on the List page.
                                    </Typography>
                                ) : (
                                    shoppingList.map((item) => (
                                        <Box
                                            key={item.id}
                                            sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}
                                        >
                                            <Typography variant="body2" sx={{ pr: 1 }}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                x{item.quantity || 1}
                                            </Typography>
                                        </Box>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Budget Breakdown
                                </Typography>
                                {isEditingBudget ? (
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <TextField
                                            type="number"
                                            size="small"
                                            label="Budget"
                                            value={budgetInput}
                                            onChange={(e) => setBudgetInput(e.target.value)}
                                            inputProps={{ min: 0, step: 0.01 }}
                                            fullWidth
                                            disabled={!user}
                                        />
                                        <Button variant="contained" onClick={saveBudget} disabled={!user}>
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
                                            disabled={!user}
                                        >
                                            Edit
                                        </Button>
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Budget</Typography>
                                    <Typography variant="body2">
                                        {budget !== null ? `$${budget.toFixed(2)}` : 'Not set'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2">Cart Spend</Typography>
                                    <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="body2">Remaining</Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: remainingBudget !== null && remainingBudget < 0 ? 'error.main' : 'success.main',
                                        }}
                                    >
                                        {remainingBudget !== null ? `$${remainingBudget.toFixed(2)}` : 'Set a budget'}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 1.5 }} />

                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    By Category
                                </Typography>
                                {Object.keys(spendingByCategory).length === 0 ? (
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                                        No spend yet.
                                    </Typography>
                                ) : (
                                    Object.entries(spendingByCategory).map(([category, amount]) => (
                                        <Box
                                            key={category}
                                            sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
                                        >
                                            <Typography variant="body2">{category}</Typography>
                                            <Typography variant="body2">${amount.toFixed(2)}</Typography>
                                        </Box>
                                    ))
                                )}

                                <Typography variant="subtitle2" sx={{ mt: 1.5, mb: 1 }}>
                                    By Store
                                </Typography>
                                {Object.keys(spendingByStore).length === 0 ? (
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        No spend yet.
                                    </Typography>
                                ) : (
                                    Object.entries(spendingByStore).map(([store, amount]) => (
                                        <Box
                                            key={store}
                                            sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
                                        >
                                            <Typography variant="body2">{store}</Typography>
                                            <Typography variant="body2">${amount.toFixed(2)}</Typography>
                                        </Box>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}