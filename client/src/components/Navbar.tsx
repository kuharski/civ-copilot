import { Link } from 'react-router';
import { useLocation } from 'react-router'
import Avatar from '@mui/material/Avatar';
export default function Navbar(){
    
    return(
        <nav className="relative flex justify-between px-6 py-4 bg-surface border-b border-border">
            <Link to={"/"}>
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-primary text-3xl">Civ Copilot</h1>
            </Link>
            <Avatar sx={{ width: 32, height: 32 }} src="/default-avatar.png" />
        </nav>
    );
}