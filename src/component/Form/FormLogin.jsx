import { useState } from "react";
import { useForm } from "react-hook-form";
import { getDocs, Query, where, collection } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebaseConfig";
import Modal from "../Modal";

const FormLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [modalMessage, setModalMessage] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // fonction de connexion
  const onSubmit = async (data) => {
    try{
      // chercher par pseudo ou email dans firestore
      const userRef = collection(db, 'users');
      const q = query(userRef, where('pseudo', '==', data.identifier), where('email', '==', data.identifier));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty){
        alert('Aucun utilisateur trouvé avec cet email ou ce pseudo');
        return;
      }

      let userDoc;
      querySnapshot.forEach((doc) => {
        userDoc = doc.data();
      });

      // verification du mot de passe 
      if (userDoc) {
        await signInWithEmailAndPassword(auth, userDoc.email, data.password);
        setModalMessage(`${userDoc.pseudo} est bien connecté`);
        setUserRole(userDoc.role);
      }
    } catch(error){
      console.error('Erreur de connexion :', error);
      alert('Echec de la connexion');
    }
  };

  // redirection vers la page d'accueil
  const handleRedirect = () => {
    if(userRole === 'admin'){
      window.location.href = '/admin-homepage'; // Redirige vers la page accueil admin
    } else {
      window.location.href = '/user-homepage'; // redirige vers la homepage user
    }
  };

  return (
    <div>
      
    </div>
  );

}
