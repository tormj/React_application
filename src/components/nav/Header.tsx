import Link from "next/link";
import Identity from "./Identity";

export default function Header() {
    return (
        <header>
            <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
                <div className="container">
                    <Link href="/" className="navbar-brand">WebApp</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <Link href="/" className="nav-link text-dark">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/todo/tasks" className="nav-link text-dark">Tasks</Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/todo/categories" className="nav-link text-dark">Categories</Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/todo/priorities" className="nav-link text-dark">Priorities</Link>
                            </li> 
                        </ul>
                        <Identity/>
                    </div>
                </div>
            </nav>
        </header>
    );
}