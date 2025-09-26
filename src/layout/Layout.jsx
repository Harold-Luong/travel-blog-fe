import Header from "./Header";
import Footer from "./Footer";

import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Header />
            <main className="container mx-auto p-1 w-4/5 flex-1">
                <div className="p-6 space-y-6 bg-vintageCream min-h-screen text-vintageBrown">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}
