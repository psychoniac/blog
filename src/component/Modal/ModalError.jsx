const ErrorModal = ( {message, onClose} ) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4">Erreur</h2>
                <p className="mb-4">{message}</p>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;