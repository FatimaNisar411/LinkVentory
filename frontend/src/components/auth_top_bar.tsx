import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AuthTopBar() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <nav className="w-full px-8 py-4 bg-gradient-to-br from-[#1e1e2f] to-[#2b2b40] shadow-md flex items-center">
      {/* Logo */}
      <h1 className="text-3xl font-bold tracking-wide text-white">LinkVentory</h1>

      {/* Spacer to push button right */}
      <div className="flex-1" />

      {/* Auth Button */}
      <div className="pr-4">
        {isLogin ? (
          <Link to="/signup">
            <Button className="bg-[#2e2e42] text-white hover:bg-[#3a3a55] text-lg font-semibold px-6 py-2.5 rounded-lg shadow-lg">
              Sign Up
            </Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button className="bg-[#2e2e42] text-white hover:bg-[#3a3a55] text-lg font-semibold px-6 py-2.5 rounded-lg shadow-lg">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}


// import { Link, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";

// export default function AuthTopBar() {
//   const location = useLocation();
//   const isLogin = location.pathname === "/login";

//   return (
//     <nav className="w-full px-8 py-5 bg-gradient-to-br from-[#1e1e2f] to-[#2b2b40] shadow-md flex justify-between items-center">
//       <h1 className="text-3xl font-bold tracking-wide text-white">LinkVentory</h1>
      
//       <div className="ml-auto pr-6">
//   {isLogin ? (
//     <Link to="/signup">
//       <Button className="bg-[#2e2e42] text-white hover:bg-[#3a3a55] text-lg font-semibold px-6 py-3 rounded-lg shadow-lg transition-all">
//         Sign Up
//       </Button>
//     </Link>
//   ) : (
//     <Link to="/login">
//       <Button className="bg-[#2e2e42] text-white hover:bg-[#3a3a55] text-lg font-semibold px-6 py-3 rounded-lg shadow-lg transition-all">
//         Login
//       </Button>
//     </Link>
//   )}
// </div>


//     </nav>
//   );
// }
