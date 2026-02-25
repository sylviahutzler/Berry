import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import storeShop from "./StoreShop";

function FromStore() {
    return (
        <div>
            <h1>Pick a store to shop from</h1>
            <Button
                component={Link}
                to={"/store/Town and Country"}
                variant="contained"
                sx={{ mr:2}}

            >
                Town and Country
            </Button>
            <Button
                component={Link}
                to={"/store/Albertsons"}
                variant="contained"
            >
                Albertsons
            </Button>
        </div>

    );
}

export default FromStore;