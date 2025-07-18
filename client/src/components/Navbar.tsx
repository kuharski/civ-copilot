import { Link } from 'react-router';
export default function Navbar(){

    return(
        <nav className="flex flex-col justify-center items-center py-4 bg-surface border-b border-border">
            <Link to={"/"}>
                <h1 className="text-primary text-3xl">Civ Copilot</h1>
            </Link>
        </nav>
    );
}