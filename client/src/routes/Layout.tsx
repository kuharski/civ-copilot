import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';
export default function Layout() {

    return(
        <div className="relative min-h-screen flex flex-col bg-background text-text font-serif">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}
