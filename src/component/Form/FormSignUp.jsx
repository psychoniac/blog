import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../../lib/firebaseConfig";

// Validation schéma avec yup
const schema = yup.object().shape({
  pseudo: yup.string().min(4, 'Le pseudo doit contenir au moins 4 caractères').required('Le pseudo est requis'),
  email: yup.string().email('Email invalide').required('Email est requis'),
  password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Le mot de passe est requis'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Les mots de passe ne correspondent pas').required('La confirmation du mot de passe est requis'),
  birthdate: yup.date().required('La date de naissance est requise').test('age', 'Vous devez avoir au moins 18 ans', (value) => {
    const today = new Date();
    const birthDate = new Date(value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())){
      age--;
    }
    return age >= 18;
  }),
  region: yup.string().optional(),
  gender: yup.string().oneOf(['male', 'female', 'other']).optional(),
  hobbies: yup.array().max(3, 'Vous pouvez choisir jusqu\'a 3 hobbis').optional(),
  work: yup.string().optional(),
  avatar: yup.mixed().test('fileType', 'Le fichier doit être un PNG', (value) => {
    if (!value.length) return true; // si aucun avatar n'est selectionné c'est valide 
    return value[0].type === 'image/png';
  }).optional()
});

export default function FormSignUp() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      // creation de l'utilisateur avec firebase auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // sauvegarde des informations supplémentaires dans firestore
      await setDoc(doc(db, 'users', user.uid) {
        pseudo: data.pseudo,
        birthdate: data.birthdate,
        region: data.region,
        gender: data.gender,
        hobbies: data.hobbies,
        work: data.work,
        avatar: data.avatar ? await handleAvatarUpload(data.avatar[0]) : null, //  upload de l'avatar si il est fournit
        role: data.pseudo === 'jlnko' ? 'admin' : 'user' // on assigne un role
      });

      reset(); // reset le formulaire après succès
      alert('Inscription réussie');
    } catch(error){
      console.error('Erreur lors de l\'inscription:', error);
      alert('Erreur lors de l\'inscription');
    }
  };

  // fonction pour gérer l'upload de l'avatar
  const handleAvatarUpload = async (file) => {
    // logique d'upload dans firebase storage 
    const storageRef = ref(storage, `avatars/${file.name}`);
    await uploadBytes(storageRef, file);
    const avatarURL = await getDownloadURL(storageRef);
    return avatarURL;
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="">Pseudo</label>
        <input type="text" {...register('pseudo')} />
        {errors.pseudo && <p>{errors.pseudo.message}</p>}
      </div>

      <div>
        <label htmlFor="">Email</label>
        <input type="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="">Mot de passe</label>
        <input type="password" {...register('password')} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="">Confirmez le mot de passe</label>
        <input type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      <div>
        <label htmlFor="">Date de naissance</label>
        <input type="date" {...register('birthdate')} />
        {errors.birthdate && <p>{errors.birthdate.message}</p>}
      </div>

      <div>
        {/* voir pour implementer une carte de france pour choisir une région ou une carte du monde pour choisir un pays */}
        <label htmlFor="">Région ou pays</label>
        <input type="text" {...register('region')} />
      </div>

      <div>
        <label>Genre</label>
        <label htmlFor="male">
          <input type="radio" value='male' {...register('gender')} name="male" id="male" />
          Homme
        </label>
        <label htmlFor="female">
          <input type="radio" value='female' {...register('gender')} name="female" id="female" />
          Femme
        </label>
        <label htmlFor="other">
          <input type="radio" value='other' {...register('gender')} name="other" id="other" />
          LGBTQIA+
        </label>
      </div>

      <div>
        <label htmlFor="hobbies">Hobbies</label>
        <select multiple {...register('hobbies')} name="hobbies" id="hobbies">
          <option value="sport">Sport</option>
          <option value="music">Musique</option>
          <option value="gaming">E-sport</option>
        </select>
      </div>

      <div>
        <label htmlFor="work">Travail</label>
        <input type="text" name="work" id="work" {...register('work')} />
      </div>

      <div>
        <label htmlFor="avatar">Avatar (PNG uniquement)</label>
        <input type="file" accept="image/png" name="avatar" id="avatar" {...register('avatar')} />
        {errors.avatar && <p>{errors.avatar.message}</p>}
      </div>

      <button type="submit">S\'inscrire</button>
    </form>
  );
};