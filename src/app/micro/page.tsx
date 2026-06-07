"use client";

import {
  CheckCircle2,
  Cpu,
  Link as LinkIcon,
  Save,
  Server,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetApiConfigByName, usePutApiConfig } from "@/lib/api/client";

export default function MicroPage() {
  const [url, setUrl] = useState("");
  const { mutateAsync, isPending, isSuccess } = usePutApiConfig();
  const { data, isLoading } = useGetApiConfigByName("microcontroller_url");

  useEffect(() => {
    if (data) {
      setUrl(data.config.value);
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      await mutateAsync({
        data: {
          name: "microcontroller_url",
          value: url,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex-1 p-6 lg:p-8 flex items-center justify-center relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="w-full max-w-xl">
        <div className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 mb-6 border border-emerald-500/20">
            <Cpu className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Microcontrolador
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Defina a URL base para onde as requisições do sistema devem ser
            enviadas no dispositivo físico.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="url"
                className="text-sm font-medium text-slate-300 ml-1"
              >
                URL do Microcontrolador
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  id="url"
                  type="url"
                  value={url}
                  disabled={isLoading}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="http://192.168.1.100"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-11 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-lg"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending || isLoading || !url}
              className={`w-full py-6 rounded-xl text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98] ${
                isSuccess
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30"
                  : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              }`}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Salvando...
                </div>
              ) : isSuccess ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Salvo com sucesso!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Salvar Configuração
                </div>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 animate-in fade-in duration-700 delay-300 fill-mode-both">
          <Server className="h-4 w-4" />
          <span>
            As alterações entram em vigor imediatamente na próxima requisição.
          </span>
        </div>
      </div>
    </main>
  );
}
