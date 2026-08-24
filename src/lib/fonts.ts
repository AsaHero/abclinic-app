import { Inter } from "next/font/google";
import localFont from "next/font/local";

// Old site loaded these as distinct font-family names (one per weight),
// not weight variants of a single family — kept as-is so component classes
// like `font-arista-bold` keep working unchanged during the migration.
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const aristaRegular = localFont({
  src: "../fonts/AristaPro-Regular.ttf",
  variable: "--font-arista-regular",
  display: "swap",
});

export const aristaLight = localFont({
  src: "../fonts/AristaPro-Light.ttf",
  variable: "--font-arista-light",
  display: "swap",
});

export const aristaExtralight = localFont({
  src: "../fonts/AristaPro-ExtraLight.ttf",
  variable: "--font-arista-extralight",
  display: "swap",
});

export const aristaSemibold = localFont({
  src: "../fonts/AristaPro-SemiBold.ttf",
  variable: "--font-arista-semibold",
  display: "swap",
});

export const aristaBold = localFont({
  src: "../fonts/AristaPro-Bold.ttf",
  variable: "--font-arista-bold",
  display: "swap",
});

export const aristaFat = localFont({
  src: "../fonts/AristaPro-Fat.ttf",
  variable: "--font-arista-fat",
  display: "swap",
});

export const aristaThin = localFont({
  src: "../fonts/AristaPro-Thin.ttf",
  variable: "--font-arista-thin",
  display: "swap",
});

export const aristaHairline = localFont({
  src: "../fonts/AristaPro-Hairline.ttf",
  variable: "--font-arista-hairline",
  display: "swap",
});

export const fontVariables = [
  inter.variable,
  aristaRegular.variable,
  aristaLight.variable,
  aristaExtralight.variable,
  aristaSemibold.variable,
  aristaBold.variable,
  aristaFat.variable,
  aristaThin.variable,
  aristaHairline.variable,
].join(" ");
