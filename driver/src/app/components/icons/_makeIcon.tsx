import type { ComponentType, CSSProperties, SVGProps } from "react";

export interface SxIconProps {
  /** MUI SvgIcon-style prop this app's call sites already use everywhere.
   *  fontSize/color map to the icon's size and color; any other CSS
   *  property (transform, opacity, animation, flexShrink, ...) is forwarded
   *  as inline style. */
  sx?: ({ fontSize?: number | string; color?: string } & CSSProperties) | undefined;
  className?: string;
  style?: CSSProperties;
}

/**
 * Wraps a Material Symbols Rounded icon (compiled on demand by
 * unplugin-icons) so every icon keeps the sx={{ fontSize, color }} call-site
 * API. Which icon file you import decides the look: the plain file is the
 * outline (stroke) form, the *Bold sibling is the filled form for selected
 * or affirmative states.
 */
export function makeIcon(Icon: ComponentType<SVGProps<SVGSVGElement>>) {
  return function IconWrapper({ sx, style, ...rest }: SxIconProps) {
    const { fontSize, color, ...restSx } = sx ?? {};
    const size = fontSize ?? 24;
    return <Icon width={size} height={size} color={color} style={{ ...restSx, ...style }} {...rest} />;
  };
}
