import { Mode } from "@/config/modes";

export const isStandalone = (mode?: string) => mode === Mode.STANDALONE;

export const isIntegrated = (mode?: string) => mode === Mode.INTEGRARTED;
