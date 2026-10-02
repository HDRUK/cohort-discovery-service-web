import { SvgIconComponent } from "@mui/icons-material";
import VpnKeyRounded from "@mui/icons-material/VpnKeyRounded";
import ShieldRounded from "@mui/icons-material/ShieldRounded";
import Google from "@mui/icons-material/Google";
import Facebook from "@mui/icons-material/Facebook";
import Microsoft from "@mui/icons-material/Microsoft";
import Apple from "@mui/icons-material/Apple";
import GitHub from "@mui/icons-material/GitHub";
import LinkedIn from "@mui/icons-material/LinkedIn";
import X from "@mui/icons-material/X";

const PROVIDER_ICON_MAP: Record<string, SvgIconComponent> = {
  google: Google,
  facebook: Facebook,
  microsoft: Microsoft,
  azure: Microsoft,
  apple: Apple,
  github: GitHub,
  linkedin: LinkedIn,
  twitter: X,
  x: X,
  keycloak: ShieldRounded,
};

export const getProviderIcon = (slug: string): SvgIconComponent =>
  PROVIDER_ICON_MAP[slug.toLowerCase()] ?? VpnKeyRounded;
