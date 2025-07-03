import { Link } from 'react-router';

export default function NotFound() {

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <h1 className="text-5xl font-bold text-danger">404</h1>
        <h2 className="text-2xl md:text-3xl mt-4">Page Not Found</h2>
        <Link to="/" className="mt-6 px-4 py-2 bg-[#8B5E3C] text-md rounded-full hover:bg-[#6F4325] transition">
            Return to Civilization
        </Link>
        </div>
    );
}