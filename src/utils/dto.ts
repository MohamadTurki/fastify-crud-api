import type z from "zod"

type DataTransferObject<T extends z.ZodTypeAny> = {
  readonly schema: T
  readonly in: z.input<T>
  readonly out: z.output<T>
}

export function createDto<T extends z.ZodTypeAny>(
  schema: T,
): DataTransferObject<T> {
  return { schema } as DataTransferObject<T>
}
