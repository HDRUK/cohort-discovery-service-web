import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

export const SortIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <g transform="translate(2, 3)">
      <path
        d="M17 14H20L16 18L12 14H15V0H17M0 14H10V16H0M4 2V4H0V2M0 8H7V10H0V8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </SvgIcon>
);
