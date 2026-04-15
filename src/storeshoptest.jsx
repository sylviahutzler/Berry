//Products State
    const [products, setProducts] = useState({});
    const { storeName } = useParams();  // ✅ GET STORE FROM URL
    const navigate = useNavigate();

    useEffect(() => {
        //Create firebase reference
        const productsRef = ref(database, "products");
        //Listen for changes
        onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) setProducts(data);
        });
    }, []);

    const filteredProducts = selectedStore //if store is selected
        //then filter products
        ? Object.fromEntries(
            Object.entries(products).filter(
                ([sku, product]) => product.store === selectedStore
            )
        )
        //else empty object
        : {};

    return (
        <Container sx={{ mt: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/store')}
                sx={{ mb: 2 }}
            >
                Back to Store Selection
            </Button>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Shopping at {storeName}
            </Typography>

            {/* Inventory Table */}
            {Object.keys(filteredProducts).length > 0 ? (
                <Paper>
                    <Typography variant="h6" sx={{ p: 2 }}>
                        Products at {storeName}
                    </Typography>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>SKU</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Quantity</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {Object.entries(filteredProducts).map(([sku, product]) => (
                                <TableRow key={sku}>
                                    <TableCell>{sku}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            ) : (
                <Typography sx={{ mt: 2 }}>
                    No products found for {storeName}
                </Typography>
            )}
        </Container>
    );