"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, User, Users, X } from "lucide-react";
import { useState } from "react";
import { api } from "@/infra/api";

interface Resident {
  id?: string | number;
  name?: string;
  nome?: string;
  photo?: string;
  photo_url?: string;
}

export default function ResidentesList() {
  const [search, setSearch] = useState("");
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null,
  );

  const {
    data: residents,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["residents"],
    queryFn: async () => {
      const res = await api.get<Resident[]>("/residents");
      return res.data;
    },
  });

  const filteredResidents = residents?.filter((r) => {
    const displayName = r.name || r.nome || "";
    return displayName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
              <div className="rounded-xl bg-emerald-500/10 p-2.5">
                <Users className="h-7 w-7 text-emerald-400" />
              </div>
              Residentes
            </h1>
            <p className="mt-2 text-slate-400">
              Gerencie e visualize os residentes cadastrados no sistema
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar residente por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 shadow-sm transition-all focus:border-emerald-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex h-[50vh] flex-col items-center justify-center rounded-3xl border border-slate-700 bg-slate-800/30 shadow-xl backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="mt-4 font-medium text-slate-400">
              Carregando residentes...
            </p>
          </div>
        ) : isError ? (
          <div className="flex h-[50vh] flex-col items-center justify-center rounded-3xl border border-red-500/30 bg-red-500/10 shadow-xl backdrop-blur-sm">
            <p className="font-medium text-red-400">
              Erro ao carregar a lista de residentes. Tente novamente mais
              tarde.
            </p>
          </div>
        ) : !filteredResidents || filteredResidents.length === 0 ? (
          <div className="flex h-[50vh] flex-col items-center justify-center rounded-3xl border border-slate-700 bg-slate-800/30 text-center shadow-xl backdrop-blur-sm">
            <div className="mb-4 rounded-full bg-slate-700/50 p-4">
              <User className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Nenhum residente encontrado
            </h3>
            <p className="mt-2 max-w-sm text-slate-400">
              {search
                ? "Nenhum residente corresponde à sua busca. Tente outro nome."
                : "Ainda não há residentes cadastrados no sistema."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredResidents.map((resident, idx) => {
              const displayName = resident.name || resident.nome || "Sem Nome";
              const photoUrl = resident.photo || resident.photo_url;
              const idDisplay = resident.id ?? `N/A`;

              return (
                <div
                  key={resident.id || idx}
                  onClick={() => setSelectedResident(resident)}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-0 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:bg-slate-700/80 hover:shadow-emerald-500/20"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-900/50">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={displayName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-20 w-20 text-slate-600 transition-transform duration-500 group-hover:scale-110 group-hover:text-emerald-500/50" />
                      </div>
                    )}
                    {/* Dark gradient overlay for text readability if text was inside, but here just adds depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80" />
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-5">
                    <h3 className="truncate text-xl font-bold text-white transition-colors group-hover:text-emerald-400 drop-shadow-md">
                      {displayName}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-md bg-slate-800/90 px-2 py-0.5 text-xs font-medium text-slate-300 shadow-sm backdrop-blur-sm border border-slate-700">
                        ID: {idDisplay}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedResident && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm transition-all"
          onClick={() => setSelectedResident(null)}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square w-full bg-slate-900">
              {selectedResident.photo || selectedResident.photo_url ? (
                <img
                  src={selectedResident.photo || selectedResident.photo_url}
                  alt={selectedResident.name || selectedResident.nome}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-24 w-24 text-slate-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent" />

              <button
                onClick={() => setSelectedResident(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-md transition-colors hover:bg-red-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 pb-6 pt-2">
              <h2 className="text-2xl font-bold text-white">
                {selectedResident.name || selectedResident.nome || "Sem Nome"}
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-900/50 p-4 border border-slate-700/50">
                  <span className="text-sm font-medium text-slate-400">
                    ID do Residente
                  </span>
                  <span className="font-semibold text-slate-200">
                    {selectedResident.id ?? "N/A"}
                  </span>
                </div>
                {/* Aqui você pode adicionar mais informações do residente futuramente */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
