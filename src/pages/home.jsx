import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
    return (
        <Box sx={{ py: 3 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Welcome to Berry
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
                Plan smarter grocery trips with your list, budget, and in-store efficiency.
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to="/list"
                        sx={{
                            py: 1.8,
                            px: 3,
                            fontSize: '1rem',
                            fontWeight: 700,
                            borderRadius: 1,
                            minWidth: { xs: '100%', md: 220 },
                        }}
                    >
                        Build Shopping List
                    </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        to="/store"
                        sx={{
                            py: 1.8,
                            px: 3,
                            fontSize: '1rem',
                            fontWeight: 700,
                            borderRadius: 1,
                            minWidth: { xs: '100%', md: 220 },
                        }}
                    >
                        Browse Store
                    </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        to="/cart"
                        sx={{
                            py: 1.8,
                            px: 3,
                            fontSize: '1rem',
                            fontWeight: 700,
                            borderRadius: 1,
                            minWidth: { xs: '100%', md: 220 },
                        }}
                    >
                        View Cart
                    </Button>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Quick Guide
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                            • 1. Build Your List: Quickly add items to your ongoing grocery list.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                            • 2. Track Budget: When its time to budget for your next trip, use your ongoing grocery list and our store feature to find the best deals near you. Add items to the cart to use our budgeting feature.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                            • 3. Shop In Person: When your ready to go to the store, go to the in-person shopping list. Your list is automatically sorted by store and aisle in that store to make your trip as efficient as possible.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default Home;