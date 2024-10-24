import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-5 shadow-lg border-b-2 border-yellow-500">
      <div className="container mx-auto flex justify-between items-center">
        {/* logo du site */}
        <div className=" text-3xl font-bold tracking-wider text-yellow-500">
          <div>
          <span className="text-white">Blog </span>Addicts
          </div>
          <div>
          <span className="text-white">Un addict qui </span>parle aux addicts...
          </div>
        </div>
        <Navbar />
        {/* Bouton call to action */}
        <div>
          <button className="bg-yellow-500 text-gray-900 py-2 rounded-full shadow-lg hover:bg-yellow-400 transition duration-200">
            Rejoins la bande ...
          </button>
        </div>
      </div>
    </header>
  )
}
