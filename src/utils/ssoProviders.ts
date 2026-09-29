import { SvgIconComponent } from "@mui/icons-material";
import VpnKeyRounded from "@mui/icons-material/VpnKeyRounded";

const PROVIDER_ICON_MAP: Record<string, SvgIconComponent> = {};

export const getProviderIcon = (slug: string): SvgIconComponent =>
  PROVIDER_ICON_MAP[slug] ?? VpnKeyRounded;
