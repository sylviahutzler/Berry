
import { Link } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
    return (
        <div>
            <div className="header">
                <div className="header-content">
                    <div className="header_logo">
                        <img src="/berry_logo.svg" alt="Berry Logo" />
                    </div>
                    <Link to="/list" className="list-button">
                        List
                        <span className="list-count" id="listCount">0</span>
                    </Link>
                    <Link to="/budget" className="budget_store_button">
                        Budget
                    </Link>
                    <Link to="/store" className="budget_store_button">
                        Store
                    </Link>
                </div>
            </div>
            <main>
                {children}
            </main>
        </div>
    );
}

export default Layout;