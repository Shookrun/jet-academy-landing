import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700">
            Page Not Found
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved to another URL.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-jsyellow text-white rounded-lg hover:bg-jsyellow/75 transition-colors"
          >
            <FaHome size={20} />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
