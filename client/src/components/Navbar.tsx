import { useNavigate } from 'react-router';
import { useLocation } from 'react-router'
import Avatar from '@mui/material/Avatar';
import { ArrowLeft } from 'lucide-react';
export default function Navbar(){
    let navigate = useNavigate();
    let location = useLocation();

    const home = location.pathname === "/";

    return(
        <nav className="relative flex justify-between px-6 py-4 bg-surface border-b border-border">
            { !home ? (
                <button onClick={() => navigate(-1)} className="text-subtle hover:text-primary">
                    <ArrowLeft className="w-5 h-5"/>
                </button>
            ) : (
                <div className="w-5 h-5" />
            )}
            <div className="flex flex-col justify-center">
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-primary text-3xl">Civ Copilot</h1>
            </div>
            <Avatar sx={{ width: 32, height: 32 }} src="/default-avatar.png" />
        </nav>
    );
}