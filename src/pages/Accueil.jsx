import CardPost from "../component/Card/CardPost";

export default function Accueil() {
  return (
    <div className="container mx-auto py-5 px-5 bg-gray-700">
      <h1 className="text-2xl pb-5 text-center text-white">Accueil</h1>
      <div className="flex flex-wrap justify-center gap-5">
      <CardPost />
      <CardPost />
      <CardPost />

      </div>

    </div>
  )
}
