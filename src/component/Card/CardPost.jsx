
export default function CardPost() {
  return (
    <div className="max-w-sm bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
      {/* Image en tête de la card */}
      <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308" alt="Street Art" className="w-full h-48 object-cover" />
      {/* Contenu de la card */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-yellow-500">Premier Post</h3>
        <p className="text-gray-400 mt-2">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum, in.
        </p>
        <button className="mt-4 bg-yellow-500 text-gray-900 px-4 rounded-full shadow-md hover:bg-yellow-400 transition duration-300">
          Affichez tout le post
        </button>
      </div>
    </div>
  );
};
