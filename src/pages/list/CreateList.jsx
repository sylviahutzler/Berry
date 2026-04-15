import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set, push, remove, update } from 'firebase/database';
import { auth, database } from '../../firebase';
import {
    Container,
    Typography,
    Alert,
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Checkbox,
    ListItemIcon,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CreateList() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('1');

    function encodeEmail(email) {
        return email.replace(/\./g, '_');
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                loadList(encodeEmail(currentUser.email));
            } else {
                setItems([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

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

    async function addItem() {
        if (!user) {
            setError('Please sign in to create a shopping list');
            return;
        }

        const trimmedName = itemName.trim();
        const parsedQty = Number(quantity);

        if (!trimmedName) {
            setError('Please enter an item name');
            return;
        }
        if (Number.isNaN(parsedQty) || parsedQty <= 0) {
            setError('Please enter a valid quantity');
            return;
        }

        try {
            setError('');
            const userEmail = encodeEmail(user.email);
            const listRef = ref(database, `shoppingLists/${userEmail}`);
            const newItemRef = push(listRef);
            await set(newItemRef, {
                name: trimmedName,
                quantity: parsedQty,
                completed: false,
                createdAt: new Date().toISOString(),
            });

            setItemName('');
            setQuantity('1');
            setSuccess('Item added to list');
            setTimeout(() => setSuccess(''), 2500);
            await loadList(userEmail);
        } catch (err) {
            setError('Error adding item: ' + err.message);
        }
    }

    async function removeItem(itemId) {
        if (!user) return;
        try {
            const userEmail = encodeEmail(user.email);
            await remove(ref(database, `shoppingLists/${userEmail}/${itemId}`));
            await loadList(userEmail);
        } catch (err) {
            setError('Error removing item: ' + err.message);
        }
    }

    async function toggleCompleted(item) {
        if (!user) return;
        try {
            const userEmail = encodeEmail(user.email);
            await update(ref(database, `shoppingLists/${userEmail}/${item.id}`), {
                completed: !item.completed,
            });
            await loadList(userEmail);
        } catch (err) {
            setError('Error updating item: ' + err.message);
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Shopping List
            </Typography>

            {!user && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    Sign in to create and save your shopping list.
                </Alert>
            )}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Add Item
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <TextField
                            label="Item name"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            sx={{ flex: 1, minWidth: 220 }}
                            disabled={!user}
                        />
                        <TextField
                            label="Qty"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            inputProps={{ min: 1 }}
                            sx={{ width: 110 }}
                            disabled={!user}
                        />
                        <Button variant="contained" onClick={addItem} disabled={!user}>
                            Add
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Your List ({items.length})
                    </Typography>
                    {loading ? (
                        <Typography variant="body2">Loading list...</Typography>
                    ) : items.length === 0 ? (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            No items yet.
                        </Typography>
                    ) : (
                        <List disablePadding>
                            {items.map((item) => (
                                <ListItem
                                    key={item.id}
                                    divider
                                    secondaryAction={(
                                        <IconButton edge="end" onClick={() => removeItem(item.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Checkbox
                                            edge="start"
                                            checked={Boolean(item.completed)}
                                            onChange={() => toggleCompleted(item)}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.name}
                                        secondary={`Quantity: ${item.quantity || 1}`}
                                        sx={{
                                            textDecoration: item.completed ? 'line-through' : 'none',
                                            opacity: item.completed ? 0.6 : 1,
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
}