import type { ComponentType, CSSProperties, SVGProps } from "react";

export interface IconProps {
  size?: number | string;
  color?: string;
  /** Accepted so call sites written for a stroke-based set keep compiling; Material Symbols are fills, so it has no effect. */
  strokeWidth?: number | string;
  className?: string;
  style?: CSSProperties;
}

/** What a page or component takes when it is handed an icon to render. */
export type AppIcon = ComponentType<IconProps>;

/**
 * Wraps a Material Symbols Rounded icon (compiled on demand by
 * unplugin-icons) so it takes size / color / className like the icons it
 * replaced. Outline (stroke) is the default form; the *FilledIcon exports
 * are for selected states.
 */
export function makeIcon(Icon: ComponentType<SVGProps<SVGSVGElement>>): AppIcon {
  return function IconWrapper({ size = 24, color, strokeWidth: _strokeWidth, style, ...rest }: IconProps) {
    return <Icon width={size} height={size} color={color} style={style} {...rest} />;
  };
}
