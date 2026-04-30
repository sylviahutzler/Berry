
import React, { useState, useEffect } from 'react';
import { db, auth, database } from '../firebase';
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
    ListItemIcon,
    Checkbox,
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { forestGreen, slate, gold, coral, mintGreen, cream } from '../components/shared-theme/themePrimitives';


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
    const [items, setItems] = useState([]);

    // Encode email address
    function encodeEmail(email) {
        return email.replace(/\./g, '_');
    }

    // Check if user is logged in
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

    // Load list from Firebase Realtime Database
    async function loadList(userEmail) {
        try {
            setError('');
            setLoading(true);
            const listRef = ref(database, `shoppingLists/${userEmail}`);
            const snapshot = await get(listRef);

            if (snapshot.exists()) {
                const listItems = snapshot.val();
                const asArray = Object.keys(listItems).map((key) => ({
                    id: key,
                    ...listItems[key],
                }));
                setItems(asArray);
            } else {
                setItems([]);
            }
            setLoading(false);
        } catch (err) {
            setError('Error loading list: ' + err.message);
            setLoading(false);
        }
    }

    //Load products from database
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
                        category: category,
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
            setError('Sign in to view products');
            setLoading(false);
        }
    }

    // Load shopping list from database
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

    // Load budget from database
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

    // Load cart items from database
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

    // Save the budget to the database
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

    // Updates the lists when the checkbox is checked
    async function toggleCompleted(item) {
        if (!user) return;
        try {
            const userEmail = encodeEmail(user.email);
            await update(ref(database, `shoppingLists/${userEmail}/${item.id}`), {
                completed: !item.completed,
            });
            await loadShoppingList(userEmail);
        } catch (err) {
            setError('Error updating item: ' + err.message);
        }
    }

    // Add item to cart
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

    // Budget calculations
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
            <Typography sx={{fontFamily: '"Meow Script", "Meow Script_R", cursive', color: slate[500],}} variant="h3" component="h1" gutterBottom >
                Find products at a specific store
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} md={8} lg={9}>
                    <Box sx={{ mb: 4 }}>
                        <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                            color: slate[500],}} variant="h6" gutterBottom>
                            Select a Store:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3,   }}>
                            {uniqueStores.map((store) => (
                                <Button
                                    sx={{
                                        fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                        borderColor: slate[500],
                                        // Selected state
                                        ...(selectedStore === store ? {
                                            backgroundColor: slate[500],
                                            color: cream[500],
                                            '&:hover': {
                                                backgroundColor: slate[700],
                                            },
                                        } : {
                                            // Unselected state
                                            color: slate[500],
                                            '&:hover': {
                                                borderColor: slate[700],
                                                backgroundColor: mintGreen[500],
                                            },
                                        }),
                                    }}
                                    key={store}
                                    variant={selectedStore === store ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedStore(store)}
                                >
                                    {store}
                                </Button>
                            ))}
                        </Box>

                        <Typography variant="body2" sx={{ color: slate[500], }}>
                            {filteredProducts.length} products
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}  >
                            {filteredProducts.map((product) => (
                                <Grid item xs={12} sm={6} xl={4} key={product.id}  >
                                    <Card sx={{ backgroundColor: cream[500], p: 2 }}>
                                        <CardContent >
                                            <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',color: slate[500]}} variant="h6" component="div" gutterBottom>
                                                {product.name}
                                            </Typography>
                                            <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',color: slate[500]}} variant="body2" gutterBottom>
                                                Isle: {product.category}
                                            </Typography>
                                            <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif', color: slate[500], my: 1}} variant="h6">
                                                ${product.price.toFixed(2)}
                                            </Typography>
                                            <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',color: slate[500]}} variant="body2" gutterBottom>
                                                {product.description}
                                            </Typography>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                sx={{
                                                    mt: 2,
                                                    color: cream[500],
                                                    backgroundColor: slate[500],
                                                    '&:hover': { backgroundColor: slate[700] },
                                                    fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
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
                        <Card sx={{ mb: 2, backgroundColor: slate[500], p: 2  }}>
                            <CardContent>
                                <Typography sx={{fontFamily: '"Meow Script", "Meow Script_R", cursive', color: cream[500],fontSize: { xs: '2rem', md: '2rem' },}} variant="h6" gutterBottom>
                                    Shopping List
                                </Typography>
                                {!user ? (
                                    <Typography variant="body2" sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                        color: cream[500]}}>
                                        Sign in to see your saved list.
                                    </Typography>
                                ) : shoppingList.length === 0 ? (
                                    <Typography variant="body2" sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                        color: cream[500]}}>
                                        No list items yet. Add items on the List page.
                                    </Typography>
                                ) : (
                                    shoppingList.map((item) => (
                                        <Box
                                            key={item.id}
                                            sx={{
                                                color: cream[500],
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                mb: 0.75}}
                                        >
                                                <Checkbox
                                                    sx={{
                                                        color: cream[500],
                                                        padding: '2px',
                                                        '&.Mui-checked': {
                                                            color: coral[500],
                                                        },
                                                    }}
                                                    checked={Boolean(item.completed)}
                                                    onChange={() => toggleCompleted(item)}
                                                    size="small"
                                                />
                                            <Typography variant="body2" sx={{
                                                flex: 1,
                                                pr: 1,
                                                fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                                textDecoration: item.completed ? 'line-through' : 'none',
                                                opacity: item.completed ? 0.5 : 1,
                                            }}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{  fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif', }}>
                                                x{item.quantity || 1}
                                            </Typography>
                                        </Box>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 2, backgroundColor: slate[500], p: 2  }}>
                            <CardContent>
                                <Typography sx={{fontFamily: '"Meow Script", "Meow Script_R", cursive', color: cream[500],fontSize: { xs: '2rem', md: '2rem' },}} variant="h6" gutterBottom>
                                    Budget Breakdown
                                </Typography>
                                {isEditingBudget ? (
                                    <Box >
                                        <TextField
                                            type="number"
                                            size="small"
                                            label="Budget"
                                            value={budgetInput}
                                            onChange={(e) => setBudgetInput(e.target.value)}
                                            inputProps={{ min: 0, step: 0.01 }}
                                            fullWidth
                                            disabled={!user}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color: cream[500], // Input text color
                                                    '& fieldset': {
                                                        borderColor: cream[500], // Border color
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: mintGreen[500], // Border on hover
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: cream[500], // Border when focused
                                                    }
                                                },
                                                '& .MuiInputBase-input': {
                                                    color: cream[500], // Text color
                                                    fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color: cream[500], // Label color
                                                    fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                                },
                                                '& .MuiInputLabel-root.Mui-focused': {
                                                    color: cream[500], // After click color
                                                },
                                            }}

                                        />
                                        <Button sx={{ backgroundColor: cream[500], color: slate[500],'&:hover': {
                                                backgroundColor: mintGreen[700], // Hover color
                                            }, fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif', }} variant="contained" onClick={saveBudget} disabled={!user}>
                                            Save
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box sx={{ mb: 2 }}>
                                        <Button
                                            sx={{
                                                backgroundColor: cream[500],
                                                color: slate[500],
                                                fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                                '&:hover': {
                                                    backgroundColor: mintGreen[500], // Darker on hover
                                                },
                                                '&:active': {
                                                    backgroundColor: mintGreen[700], // Even darker when clicked
                                                },
                                                '&:disabled': {
                                                    backgroundColor: cream[300],
                                                    color: cream[500],
                                                }
                                            }}
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
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1,
                                    color: cream[500], }}>
                                    <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif'}} variant="body2">Budget</Typography>
                                    <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif'}} variant="body2">
                                        {budget !== null ? `$${budget.toFixed(2)}` : 'Not set'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1,
                                    color: cream[500], }}>
                                    <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif'}} variant="body2">Cart Spend</Typography>
                                    <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif'}} variant="body2">${subtotal.toFixed(2)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                    color: cream[500], }}>
                                    <Typography sx={{fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif'}} variant="body2">Remaining</Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                            fontWeight: 'bold',
                                            color: remainingBudget !== null && remainingBudget < 0 ? coral[200] : forestGreen[200],
                                        }}
                                    >
                                        {remainingBudget !== null ? `$${remainingBudget.toFixed(2)}` : 'Set a budget'}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 1.5 }} />

                                <Typography variant="subtitle2" sx={{ mb: 1, fontFamily: '"Meow Script", "Meow Script_R", cursive',
                                    color: cream[500], fontSize: { xs: '2rem', md: '2rem' },}}>
                                    By Category
                                </Typography>
                                {Object.keys(spendingByCategory).length === 0 ? (
                                    <Typography variant="body2" sx={{ fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                        color: cream[500], mb: 1.5 }}>
                                        No items selected yet.
                                    </Typography>
                                ) : (
                                    Object.entries(spendingByCategory).map(([category, amount]) => (
                                        <Box
                                            key={category}
                                            sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5,  }}
                                        >
                                            <Typography sx={{ fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                                color: cream[500]}}
                                                        variant="body2">{category}</Typography>
                                            <Typography sx={{ fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                                color: cream[500]}}
                                                        variant="body2">${amount.toFixed(2)}</Typography>
                                        </Box>
                                    ))
                                )}

                                <Typography variant="subtitle2" sx={{ fontFamily: '"Meow Script", "Meow Script_R", cursive',
                                    color: cream[500], fontSize: { xs: '2rem', md: '2rem' },mt: 1.5, mb: 1 }}>
                                    By Store
                                </Typography>
                                {Object.keys(spendingByStore).length === 0 ? (
                                    <Typography variant="body2" sx={{  fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                                        color: cream[500] }}>
                                        No spend yet.
                                    </Typography>
                                ) : (
                                    Object.entries(spendingByStore).map(([store, amount]) => (
                                        <Box
                                            key={store}
                                            sx={{
                                                color: cream[500], display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
                                        >
                                            <Typography sx={{  fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',}} variant="body2">{store}</Typography>
                                            <Typography sx={{  fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',}} variant="body2">${amount.toFixed(2)}</Typography>
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