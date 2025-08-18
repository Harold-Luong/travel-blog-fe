

import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function Breadcrumb({ items = [] }) {
    return (
        <nav className="text-sm mb-4">
            <ol className="list-reset flex items-center text-vintageBrown">
                {/* Icon home */}
                <li className="flex items-center">
                    <Link to="/" className="flex items-center hover:text-vintageGreen">
                        <Home size={16} className="mr-1" />
                        Home
                    </Link>
                    {items.length > 0 && <span className="mx-2 text-gray-400">›</span>}
                </li>

                {items.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                        {item.path ? (
                            <Link
                                to={item.path}
                                className="hover:underline hover:text-vintageGreen"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-600 font-medium">{item.label}</span>
                        )}
                        {idx < items.length - 1 && (
                            <span className="mx-2 text-gray-400">›</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
