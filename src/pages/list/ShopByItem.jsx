function ShopByItem{
    return (
        <div>
            <h1>Shopping List</h1>
            <p>Your items will appear here.</p>
        </div>
    <Container>
        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
            Grocery Inventory
        </Typography>

        <Paper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>SKU</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Store</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {Object.entries(products).map(([sku, product]) => (
                        <TableRow key={sku}>
                            <TableCell>{sku}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>${product.price}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>{product.store}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    </Container>
    );
}

export default ShopByItem;
