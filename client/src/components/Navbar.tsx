import { useNavigate } from 'react-router';
import Avatar from '@mui/material/Avatar';
import { ArrowLeft } from 'lucide-react';
export default function Navbar(){
    let navigate = useNavigate();
    return(
        <nav className="flex justify-between px-3 py-2 bg-surface text-text border-b border-border">
            <button onClick={() => navigate(-1)} className="text-subtle hover:text-primary">
                <ArrowLeft className="w-5 h-5"/>
            </button>
            <h1 className="text-primary text-lg">Civ Copilot</h1>
            <Avatar src="/default-avatar.png" />
        </nav>
    );
}