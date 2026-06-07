"use client";

import { Download, Info, ShieldCheck, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MobilePage() {
  const router = useRouter();

  return (
    <main className="flex-1 p-6 lg:p-8 flex items-center justify-center relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-xl">
        <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 mb-6 border border-blue-500/20">
            <Smartphone className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Aplicativo Mobile
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Baixe o aplicativo Android para realizar o reconhecimento facial e
            gerenciar acessos diretamente do seu celular.
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both text-center space-y-8">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="h-32 w-32 bg-slate-800/80 rounded-2xl border-2 border-slate-700 border-dashed flex items-center justify-center mb-6 relative group hover:border-blue-500/50 transition-colors">
              <Smartphone className="h-12 w-12 text-slate-500 group-hover:text-blue-400 transition-colors" />
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">
                APK
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              FaceID Mobile{" "}
              <span className="text-slate-500 text-sm font-normal">v1.0.0</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xs mx-auto flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Seguro e verificado
            </p>
          </div>

          <Button
            onClick={() =>
              router.push(
                "https://github.com/Maciel64/a3-sd-mobile/blob/main/releases/0.0.2_app-release.apk?raw=true",
              )
            }
            className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 py-6 rounded-xl text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98] group"
          >
            <Download className="h-5 w-5 mr-2 group-hover:-translate-y-0.5 transition-transform" />
            Baixar Aplicativo (APK)
          </Button>

          <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/10 p-4 rounded-xl text-left">
            <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-400">
              <strong className="text-slate-300">Nota de instalação:</strong>{" "}
              Como o aplicativo não está na Play Store, você precisará habilitar
              a instalação de "Fontes Desconhecidas" nas configurações de
              segurança do seu aparelho Android.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
