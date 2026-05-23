"use client"

import { useState, useRef, type ChangeEvent, type FormEvent } from "react"
import { Upload, User, Mail, Calendar, X, Camera } from "lucide-react"

interface FormData {
  nome: string
  email: string
  idade: string
  imagem: File | null
}

export default function Login() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    idade: "",
    imagem: null,
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, imagem: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imagem: null }))
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log("Dados do formulário:", formData)
    // Aqui você pode adicionar a lógica de envio para o backend
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4">
            <Camera className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Reconhecimento Facial
          </h1>
          <p className="text-slate-400">
            Cadastre seus dados para validação
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Nome */}
            <div className="space-y-2">
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-slate-300"
              >
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Digite seu nome"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Campo Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Campo Idade */}
            <div className="space-y-2">
              <label
                htmlFor="idade"
                className="block text-sm font-medium text-slate-300"
              >
                Idade
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="number"
                  id="idade"
                  name="idade"
                  value={formData.idade}
                  onChange={handleInputChange}
                  placeholder="Sua idade"
                  min="1"
                  max="120"
                  className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Campo Upload de Imagem */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Foto para reconhecimento
              </label>

              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-600 hover:border-emerald-500/50 hover:bg-slate-700/30"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">
                    <span className="text-emerald-500 font-medium">
                      Clique para enviar
                    </span>{" "}
                    ou arraste a imagem
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    PNG, JPG ou JPEG (máx. 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden bg-slate-900/50 border border-slate-600">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <div className="p-3 border-t border-slate-700">
                    <p className="text-sm text-slate-300 truncate">
                      {formData.imagem?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formData.imagem &&
                        (formData.imagem.size / 1024 / 1024).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 active:scale-[0.98]"
            >
              Salvar dados de usuário
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Seus dados serão utilizados apenas para reconhecimento facial
        </p>
      </div>
    </div>
  )
}