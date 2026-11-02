import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Briefcase, ExternalLink, Trash2, Image, X, Loader2 } from 'lucide-react'

export const PortfolioPage = ({ currentSession }) => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('Tous')

    // États pour le formulaire d'ajout (visible uniquement si c'est toi)
    const [showAddForm, setShowAddForm] = useState(false)
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('Peinture')
    const [description, setDescription] = useState('')
    const [projectUrl, setProjectUrl] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)

    // ID de l'administrateur (tu peux remplacer par ton ID Supabase si besoin, ou laisser ouvert au créateur)
    // Par défaut, on autorise si l'utilisateur est connecté et qu'il souhaite ajouter un projet.

    useEffect(() => {
        const fetchPortfolio = async () => {
            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('portfolio_items')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setProjects(data || [])
            } catch (err) {
                console.error("Erreur chargement portfolio:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchPortfolio()
    }, [])

    // Gestion de l'image
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    // Ajouter un projet
    const handleCreateProject = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setErrorMsg(null)

        try {
            if (!title.trim() || !description.trim()) {
                throw new Error("Le titre et la description sont obligatoires.")
            }

            let publicImageUrl = null

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `portfolio-${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('post-images')
                    .upload(fileName, imageFile)

                if (uploadError) throw uploadError

                const { data: publicURLData } = supabase.storage
                    .from('post-images')
                    .getPublicUrl(fileName)

                publicImageUrl = publicURLData.publicUrl
            }

            const { error: insertError } = await supabase.from('portfolio_items').insert([
                {
                    user_id: currentSession.user.id,
                    title: title.trim(),
                    category,
                    description: description.trim(),
                    project_url: projectUrl.trim() || null,
                    image_url: publicImageUrl,
                },
            ])

            if (insertError) throw insertError

            // Reset et rechargement
            setTitle('')
            setDescription('')
            setProjectUrl('')
            setImageFile(null)
            setImagePreview(null)
            setShowAddForm(false)
            //fetchPortfolio()
        } catch (err) {
            setErrorMsg(err.message || "Erreur lors de l'ajout du projet.")
        } finally {
            setSubmitting(false)
        }
    }

    // Supprimer un projet
    const handleDeleteProject = async (id, imageUrl) => {
        if (!window.confirm("Supprimer ce projet du portfolio ?")) return

        try {
            if (imageUrl) {
                const urlParts = imageUrl.split('/')
                const fileName = urlParts[urlParts.length - 1]
                await supabase.storage.from('post-images').remove([fileName])
            }

            const { error } = await supabase.from('portfolio_items').delete().eq('id', id)
            if (error) throw error

            setProjects((prev) => prev.filter((p) => p.id !== id))
        } catch (err) {
            alert("Erreur lors de la suppression : " + err.message)
        }
    }

    // Filtrage par catégorie
    const categories = ['Tous', 'Peinture', 'Écriture', 'Web App', 'Autre']
    const filteredProjects = selectedCategory === 'Tous'
        ? projects
        : projects.filter((p) => p.category === selectedCategory)

    return (
        <div className="space-y-8">

            {/* En-tête du Portfolio */}
            <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-black text-yellow-400 p-1 border border-black">
                            <Briefcase size={20} />
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
              // PORTFOLIO & CRÉATIONS
                        </h2>
                    </div>
                    <p className="font-mono text-xs text-zinc-600">
                        Peintures, textes, applications web et travaux artistiques.
                    </p>
                </div>

                {/* Bouton d'ajout visible si connecté */}
                {currentSession && (
                    <Button
                        variant="primary"
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="text-xs"
                    >
                        {showAddForm ? "Fermer le formulaire" : "+ Ajouter un projet"}
                    </Button>
                )}
            </div>

            {/* Formulaire d'ajout de projet */}
            {showAddForm && currentSession && (
                <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-lg font-black uppercase mb-4">// NOUVEAU PROJET PORTFOLIO</h3>

                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-100 border-2 border-red-600 text-red-800 font-mono text-xs">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleCreateProject} className="space-y-4">
                        <Input
                            label="Titre du projet"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="ex: Toile acrylique #04 ou App Weather"
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="font-mono text-xs font-bold uppercase">Catégorie</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="px-3 py-2 bg-white font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50"
                            >
                                <option value="Peinture">Peinture</option>
                                <option value="Écriture">Écriture</option>
                                <option value="Web App">Web App</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="font-mono text-xs font-bold uppercase">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                required
                                className="px-3 py-2 bg-white font-mono text-sm border-2 border-black focus:outline-none focus:bg-yellow-50 resize-none"
                                placeholder="Décris ton projet..."
                            />
                        </div>

                        <Input
                            label="Lien externe (Optionnel - ex: GitHub ou site live)"
                            type="url"
                            value={projectUrl}
                            onChange={(e) => setProjectUrl(e.target.value)}
                            placeholder="https://..."
                        />

                        {/* Image du projet */}
                        <div>
                            <label className="font-mono text-xs font-bold uppercase block mb-1.5">Image / Aperçu</label>
                            {!imagePreview ? (
                                <label className="border-2 border-dashed border-black p-4 flex flex-col items-center justify-center gap-2 bg-zinc-50 hover:bg-yellow-50 cursor-pointer">
                                    <Image size={24} />
                                    <span className="font-mono text-xs font-bold uppercase">Ajouter une image</span>
                                    <input type="file" accept="image/*" onChange={imageFile} className="hidden" />
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            ) : (
                                <div className="relative inline-block border-2 border-black p-1 bg-zinc-100">
                                    <img src={imagePreview} alt="Aperçu" className="h-32 object-cover" />
                                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-2 right-2 p-1 bg-black text-white">
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <Button type="submit" variant="primary" className="w-full">
                            {submitting ? 'ENREGISTREMENT...' : 'PUBLIER DANS LE PORTFOLIO'}
                        </Button>
                    </form>
                </div>
            )}

            {/* Filtres par catégorie */}
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 font-mono text-xs font-bold uppercase border-2 border-black transition-colors cursor-pointer ${selectedCategory === cat
                            ? 'bg-black text-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white hover:bg-zinc-100'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grille des projets */}
            {loading ? (
                <div className="flex justify-center items-center py-20 font-mono text-sm bg-white border-2 border-black">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    <span>CHARGEMENT DU PORTFOLIO...</span>
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-mono text-[10px] font-bold uppercase bg-yellow-400 text-black px-2 py-0.5 border border-black">
                                        {project.category}
                                    </span>

                                    {/* Suppression si connecté */}
                                    {currentSession && (
                                        <button
                                            onClick={() => handleDeleteProject(project.id, project.image_url)}
                                            className="p-1 bg-red-600 text-white hover:bg-black transition-colors"
                                            title="Supprimer le projet"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>

                                {project.image_url && (
                                    <div className="mb-4 border-2 border-black overflow-hidden bg-zinc-100 h-48">
                                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" />
                                    </div>
                                )}

                                <h3 className="text-xl font-black uppercase mb-2">{project.title}</h3>
                                <p className="font-sans text-xs text-zinc-700 leading-relaxed mb-4 whitespace-pre-line">
                                    {project.description}
                                </p>
                            </div>

                            {project.project_url && (
                                <div className="pt-3 border-t-2 border-dashed border-zinc-300">
                                    <a
                                        href={project.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-black hover:text-yellow-600 underline"
                                    >
                                        <span>Voir le projet en ligne</span>
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border-2 border-black p-10 text-center font-mono text-sm text-zinc-600 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    Aucun projet dans cette catégorie pour le moment.
                </div>
            )}

        </div>
    )
}