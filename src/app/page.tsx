"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Camera, ImageIcon, Upload, User, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CameraCapture } from "@/components/camera-capture";
import { api } from "@/infra/api";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  photo: z.instanceof(File, { message: "Foto é obrigatória" }),
});

type FormData = z.infer<typeof schema>;
type InputMode = "upload" | "camera";

export default function Login() {
  const {
    register,
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
  const [isDragging, setIsDragging] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>("upload");

  const [mutationError, setMutationError] = useState<string | null>(null);

  const mutation = useMutation<void, AxiosError, FormData>({
    mutationFn: async (data) => {
      const payload = new FormData();

      payload.append("name", data.name);
      payload.append("photo", data.photo);

      await api.post("/embeed", payload);
    },
    onError: (error) => {
      const message =
        error.response?.data &&
        typeof error.response.data === "object" &&
        "error" in error.response.data
          ? (error.response.data as { error: string }).error
          : "Erro ao cadastrar usuário. Tente novamente.";
      setMutationError(message);
    },
    onSuccess: () => setMutationError(null),
  });

  const clearError = () => setMutationError(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    clearError();
    setValue("photo", file, { shouldValidate: true });
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const removeImage = () => {
    clearError();
    setValue("photo", undefined as unknown as File, { shouldValidate: true });
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (data: FormData) => {
    clearError();
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-emerald-500/10 p-4">
            <Camera className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            Reconhecimento Facial
          </h1>
          <p className="text-slate-400">Cadastre seus dados para validação</p>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 shadow-xl backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-300"
              >
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  id="name"
                  placeholder="Digite seu nome"
                  {...register("name")}
                  className="w-full rounded-xl border border-slate-600 bg-slate-900/50 py-3 pl-11 pr-4 text-white placeholder-slate-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-300">
                  Foto para reconhecimento
                </label>
                {!previewUrl && (
                  <div className="flex gap-1 rounded-lg bg-slate-700/50 p-0.5">
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
                  </div>
                )}
              </div>

              {previewUrl ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-600 bg-slate-900/50">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-48 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-2 top-2 rounded-full bg-red-500/90 p-1.5 transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  <div className="border-t border-slate-700 p-3">
                    <p className="truncate text-sm text-slate-300">
                      {photo?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {photo && (photo.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : inputMode === "upload" ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
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
                  <Upload className="mx-auto mb-3 h-10 w-10 text-slate-500" />
                  <p className="text-sm text-slate-400">
                    <span className="font-medium text-emerald-500">
                      Clique para enviar
                    </span>{" "}
                    ou arraste a imagem
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    PNG, JPG ou JPEG (máx. 5MB)
                  </p>
                </div>
              ) : (
                <CameraCapture
                  onCapture={(file) => {
                    processFile(file);
                    setInputMode("upload");
                  }}
                  onCancel={() => setInputMode("upload")}
                />
              )}
              {errors.photo && (
                <p className="text-xs text-red-400">{errors.photo.message}</p>
              )}
            </div>

            {mutationError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center">
                <p className="text-sm text-red-400">{mutationError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-xl bg-emerald-600 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-500/40 active:scale-[0.98] disabled:opacity-50"
            >
              {mutation.isPending ? "Salvando..." : "Salvar dados de usuário"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Seus dados serão utilizados apenas para reconhecimento facial
        </p>
      </div>
    </div>
  );
}
