
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Logo et texte */}
        <div className="text-yellow-500 text-2xl font-bold">
          <span className="text-white">Blog</span>Addicts
        </div>

        {/* Liens du footer */}
        <nav className="flex space-x-6">
          <a href="#" className="text-sm hover:text-yellow-500 transition duration-200">Privacy police</a>
          <a href="#" className="text-sm hover:text-yellow-500 transition duration-200">Ters of service</a>
          <a href="#" className="text-sm hover:text-yellow-500 transition duration-200">Contact</a>
        </nav>
        {/* Réseaux sociaux */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-yellow-500 transition duration-200">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="hover:text-yellow-500 transition duration-200">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="hover:text-yellow-500 transition duration-200">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        @ 2024 BlogAddict. All rights reserved.
      </div>
    </footer>
  );
};
