import React from 'react';
import { Box, Button, Grid, Typography, alpha } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { forestGreen, slate, gold, coral, mintGreen } from '../components/shared-theme/themePrimitives';

function Home() {
    return (
        <Box sx={{ py: 3 }}>
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontFamily: '"Meow Script", "Meow Script_R", cursive',
                    fontSize: { xs: '3rem', md: '4rem' },
                    color: gold[500],
                    fontWeight: 550,
                }}
            >
                Welcome to Berry
            </Typography>
            <Typography variant="h6" sx={{
                mb: 3,
                fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                color: gold[500], }}>
                Plan smarter grocery trips with your list, budget, and in-store shopping list.
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        to="/list"
                        sx={{
                            width: '100%',
                            py: 1.8,
                            px: 3,
                            fontSize: { xs: '1.3rem', md: '1.5rem' },
                            fontWeight: 700,
                            borderRadius: '8px',
                            minWidth: { xs: '100%', md: 220 },
                            fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                            textTransform: 'none',
                            backgroundColor: coral[500],
                            color: '#faf3dd',
                            boxShadow: `0 4px 6px -1px ${alpha(coral[500], 0.2)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: coral[600],
                                boxShadow: `0 10px 15px -3px ${alpha(coral[500], 0.3)}`,
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        Build Shopping List
                    </Button>
                    <Typography variant="body1" sx={{ lineHeight: 1.8,
                        fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                        color: gold[500],
                        fontSize: { xs: '1.3rem', md: '1.5rem' }
                    }}>
                        Quickly add items to your ongoing grocery list.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        to="/store"
                        sx={{
                            width: '100%',
                            py: 1.8,
                            px: 3,
                            fontSize: { xs: '1.3rem', md: '1.5rem' },
                            fontWeight: 700,
                            borderRadius: '8px',
                            minWidth: { xs: '100%', md: 220 },
                            fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                            textTransform: 'none',
                            backgroundColor: slate[500],
                            color: '#faf3dd',
                            boxShadow: `0 4px 6px -1px ${alpha(slate[500], 0.2)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: slate[600],
                                boxShadow: `0 10px 15px -3px ${alpha(slate[500], 0.3)}`,
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        Browse Store
                    </Button>
                    <Typography variant="body1" sx={{ lineHeight: 1.8,
                        fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif' ,
                        color: gold[500],
                        fontSize: { xs: '1.3rem', md: '1.5rem' }
                    }}>
                        When its time to budget for your next trip, use your ongoing grocery list and our store feature to find the best deals near you. Add items to the cart to use our budgeting feature.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Button
                        variant="outlined"
                        component={RouterLink}
                        to="/cart"
                        sx={{
                            width: '100%',
                            py: 1.8,
                            px: 3,
                            fontSize: { xs: '1.3rem', md: '1.5rem' },
                            fontWeight: 700,
                            borderRadius: '8px',
                            minWidth: { xs: '100%', md: 220 },
                            fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                            textTransform: 'none',
                            backgroundColor:  forestGreen[500],
                            color: '#faf3dd',
                            boxShadow: `0 4px 6px -1px ${alpha( forestGreen[500], 0.2)}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor:  forestGreen[500],
                                boxShadow: `0 10px 15px -3px ${alpha( forestGreen[500], 0.3)}`,
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        View Cart
                    </Button>
                    <Typography variant="body1" sx={{ lineHeight: 1.8,
                        fontFamily: '"Barlow Condensed-R", "Barlow Condensed", sans-serif',
                        color: gold[500],
                        fontSize: { xs: '1.3rem', md: '1.5rem' }
                    }}>
                        When your ready to go to the store, go to the in-person shopping list. Your list is automatically sorted by store and aisle in that store to make your trip as efficient as possible.
                    </Typography>
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, fontFamily: '"Meow Script", "Meow Script_R", cursive' }}>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>

                    </Grid>
                    <Grid item xs={12} md={6}>

                    </Grid>
                    <Grid item xs={12} md={6}>

                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default Home;