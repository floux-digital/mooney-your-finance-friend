import brand from "@/assets/icons/brand.svg";
import inicio from "@/assets/icons/inicio.svg";
import assistente from "@/assets/icons/assistente.svg";
import novo from "@/assets/icons/novo.svg";
import split from "@/assets/icons/split.svg";
import hide from "@/assets/icons/hide.svg";
import waveOn from "@/assets/icons/waveOn.svg";
import waveOff from "@/assets/icons/waveOff.svg";
import dash from "@/assets/icons/dash.svg";
import dots from "@/assets/icons/dots.svg";
import upload from "@/assets/icons/upload.svg";
import left from "@/assets/icons/left.svg";
import like from "@/assets/icons/like.svg";
import dislike from "@/assets/icons/dislike.svg";
import topRight from "@/assets/icons/topRight.svg";

export const icons = {
  brand,
  inicio,
  assistente,
  novo,
  split,
  hide,
  waveOn,
  waveOff,
  dash,
  dots,
  upload,
  left,
  like,
  dislike,
  topRight,
};

export function Icon({
  name,
  size = 24,
  invert = false,
  alt = "",
}: {
  name: keyof typeof icons;
  size?: number;
  invert?: boolean;
  alt?: string;
}) {
  return (
    <img
      src={icons[name]}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={invert ? "mooney-invert" : undefined}
    />
  );
}
