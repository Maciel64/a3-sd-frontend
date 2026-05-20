"use client";

import { api } from "@/infra/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import z from "zod";

const submitPhotoMutationSchema = z.object({
  file: z.instanceof(FileList),
});

export type SubmitPhotoMutationData = z.infer<typeof submitPhotoMutationSchema>;

export default function Home() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SubmitPhotoMutationData>({
    resolver: zodResolver(submitPhotoMutationSchema),
  });

  const submitPhotoMutation = useMutation<
    { success: boolean },
    AxiosError,
    SubmitPhotoMutationData
  >({
    mutationFn: async (data: SubmitPhotoMutationData) => {
      const formData = new FormData();

      formData.append("file", data.file[0]);

      const res = await api.post("/embeed", formData);

      console.log(res);

      return res.data;
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => submitPhotoMutation.mutate(data))}>
      <input type="file" {...register("file")} />
      <button type="submit">Submit</button>

      {errors.file?.message && <p>{errors.file.message}</p>}
    </form>
  );
}
