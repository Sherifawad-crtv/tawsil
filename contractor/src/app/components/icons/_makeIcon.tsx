import type { ComponentType, CSSProperties } from "react";

interface SolarIconProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  className?: string;
  style?: CSSProperties;
}

export interface SxIconProps {
  /** MUI SvgIcon-style prop this app's call sites already use everywhere.
   *  fontSize/color map to the Solar icon's own size/color; any other CSS
   *  property (transform, opacity, animation, flexShrink, ...) is forwarded
   *  as inline style, same as MUI's sx did. */
  sx?: ({ fontSize?: number | string; color?: string } & CSSProperties) | undefined;
  className?: string;
  style?: CSSProperties;
}

/**
 * Adapter so every icon component keeps the sx={{ fontSize, color }}
 * call-site API this app inherited from MUI's SvgIcon, while actually
 * rendering a real Solar Icons component underneath - no call site needs
 * to change when the icon set does.
 */
export function makeIcon(Icon: ComponentType<SolarIconProps>) {
  return function IconWrapper({ sx, style, ...rest }: SxIconProps) {
    const { fontSize, color, ...restSx } = sx ?? {};
    return <Icon size={fontSize} color={color} strokeWidth={1.8} style={{ ...restSx, ...style }} {...rest} />;
  };
}
