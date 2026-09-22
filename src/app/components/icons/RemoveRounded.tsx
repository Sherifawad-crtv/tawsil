import SvgIcon, { type SvgIconProps } from "@mui/material/SvgIcon";

/** Sourced from google/material-design-icons (Remove, round style, 24px). */
export default function RemoveRounded(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z" />
    </SvgIcon>
  );
}
