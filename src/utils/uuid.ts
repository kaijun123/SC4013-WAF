import { v5 as uuidv5 } from "uuid"

const UUID_V5_NAMESPACE = "55eb435e-9ea5-44f4-90b2-8d1fdf18115a";

export const genUuid = (input: string | string[], namespace: string = UUID_V5_NAMESPACE): string => {
  if (Array.isArray(input))
    input = input.join(":");
  return uuidv5(input, namespace);
};