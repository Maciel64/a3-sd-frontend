"use client"

import { Camera, User, ScanFace, ShieldCheck } from "lucide-react"

export default function ValidarRosto() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4">
            <ScanFace className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Validar Rosto
          </h1>
          <p className="text-slate-400">
            Posicione seu rosto na câmera para verificação
          </p>
        </div>

        {/* Card Principal */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
          {/* Área da Câmera */}
          <div className="relative mb-6">
            <div className="aspect-[4/3] w-full bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-600 relative">
              {/* Placeholder da câmera */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Camera className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-500 text-sm">Câmera em tempo real</p>
              </div>

              {/* Overlay de detecção facial */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-60 border-2 border-dashed border-emerald-400/50 rounded-[50%]" />
              </div>

              {/* Cantos decorativos */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-emerald-400 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-emerald-400 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-emerald-400 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-emerald-400 rounded-br-lg" />

              {/* Indicador de gravação */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-slate-300 font-medium">AO VIVO</span>
              </div>
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Instruções
            </h3>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Mantenha o rosto centralizado no quadro</li>
              <li>• Certifique-se de ter boa iluminação</li>
              <li>• Remova óculos escuros ou acessórios que cubram o rosto</li>
            </ul>
          </div>

          {/* Botão Validar */}
          <button
            type="button"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30"
          >
            <ShieldCheck className="w-5 h-5" />
            Validar Rosto
          </button>

          {/* Status indicator */}
          <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span>Pronto para validação</span>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Seus dados são protegidos e criptografados
        </p>
      </div>
    </div>
  )
}
