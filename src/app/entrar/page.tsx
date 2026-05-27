"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  Camera,
  CheckCircle2,
  ImageIcon,
  ScanFace,
  ShieldCheck,
  Upload,
  User,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CameraCapture } from "@/components/camera-capture";
import { api } from "@/infra/api";

const schema = z.object({
  photo: z.instanceof(File, { message: "Foto é obrigatória" }),
});

type FormData = z.infer<typeof schema>;
type InputMode = "camera" | "upload";

interface RecognizeResponse {
  nome: string;
}

export default function ValidarRosto() {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const photo = watch("photo");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("camera");
  const [residentName, setResidentName] = useState<string | null>(null);

  const mutation = useMutation<RecognizeResponse, AxiosError, FormData>({
    mutationFn: async (data) => {
      const payload = new FormData();
      payload.append("photo", data.photo);
      const res = await api.post<RecognizeResponse>("/recognize", payload);
      return res.data;
    },
    onSuccess: (data) => {
      setResidentName(data.nome);
    },
  });

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setValue("photo", file, { shouldValidate: true });
    setResidentName(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const reset = () => {
    setValue("photo", undefined as unknown as File, { shouldValidate: true });
    setPreviewUrl(null);
    setResidentName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-emerald-500/10 p-4">
              <ScanFace className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              Validar Rosto
            </h1>
            <p className="text-slate-400">
              Posicione seu rosto na câmera para verificação
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  Imagem para validação
                </label>
                {!previewUrl && (
                  <div className="flex gap-1 rounded-lg bg-slate-700/50 p-0.5">
                    <button
                      type="button"
                      onClick={() => setInputMode("camera")}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        inputMode === "camera"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Câmera
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode("upload")}
                      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        inputMode === "upload"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      Upload
                    </button>
                  </div>
                )}
              </div>

              {previewUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-600 bg-slate-900/50">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={reset}
                    className="absolute right-2 top-2 rounded-full bg-red-500/90 p-1.5 transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : inputMode === "camera" ? (
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 z-10">
                    <div className="relative aspect-[4/3] w-full rounded-xl">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-60 w-48 rounded-[50%] border-2 border-dashed border-emerald-400/50" />
                      </div>
                      <div className="absolute left-4 top-4 h-8 w-8 rounded-tl-lg border-l-2 border-t-2 border-emerald-400" />
                      <div className="absolute right-4 top-4 h-8 w-8 rounded-tr-lg border-r-2 border-t-2 border-emerald-400" />
                      <div className="absolute bottom-4 left-4 h-8 w-8 rounded-bl-lg border-l-2 border-b-2 border-emerald-400" />
                      <div className="absolute bottom-4 right-4 h-8 w-8 rounded-br-lg border-r-2 border-b-2 border-emerald-400" />
                      <div className="absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                        <span className="text-xs font-medium text-slate-300">
                          AO VIVO
                        </span>
                      </div>
                    </div>
                  </div>
                  <CameraCapture
                    onCapture={(file) => processFile(file)}
                    onCancel={() => setInputMode("upload")}
                  />
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 p-10 text-center transition-all hover:border-emerald-500/50 hover:bg-slate-700/30"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="mb-3 h-10 w-10 text-slate-500" />
                  <p className="text-sm text-slate-400">
                    <span className="font-medium text-emerald-500">
                      Clique para enviar
                    </span>{" "}
                    uma foto
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    PNG, JPG ou JPEG (máx. 5MB)
                  </p>
                </div>
              )}
              {errors.photo && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.photo.message}
                </p>
              )}
            </div>

            {residentName ? (
              <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-400" />
                <p className="text-lg font-semibold text-emerald-400">
                  Residente encontrado
                </p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {residentName}
                </p>
              </div>
            ) : (
              <div className="mb-6 rounded-lg bg-slate-700/30 p-4">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <User className="h-4 w-4" />
                  Instruções
                </h3>
                <ul className="space-y-1 text-xs text-slate-400">
                  <li>• Mantenha o rosto centralizado no quadro</li>
                  <li>• Certifique-se de ter boa iluminação</li>
                  <li>
                    • Remova óculos escuros ou acessórios que cubram o rosto
                  </li>
                </ul>
              </div>
            )}

            {!residentName && (
              <button
                type="submit"
                disabled={!photo || mutation.isPending}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 py-4 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-500/30 disabled:opacity-50"
              >
                <ShieldCheck className="h-5 w-5" />
                {mutation.isPending ? "Validando..." : "Validar Rosto"}
              </button>
            )}

            {!residentName && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-400">
                <div
                  className={`h-2 w-2 rounded-full ${photo ? "bg-emerald-500" : "bg-slate-500"}`}
                />
                <span>{photo ? "Imagem capturada" : "Aguardando imagem"}</span>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Seus dados são protegidos e criptografados
          </p>
        </div>
      </div>
    </form>
  );
}
