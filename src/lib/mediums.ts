/**
 * The palette is not arbitrary. Every colour on the site is named after a real microbiology
 * growth medium, and each section of the page "grows" on one. The HUD reads the current medium out.
 */
export type Medium = {
  /** Shown in the HUD readout. */
  name: string;
  bg: string;
  ink: string;
  /** WebGL cell colours, used only by the sections where the cell stage is live. */
  cell: string;
  cellEdge: string;
  /** Colour of text seen through the cell. */
  cellInk: string;
  nucleus: string;
  nucleusCore: string;
  shadow: string;
  /** 0–1 strength of the thin-film sheen (E. coli really does this on EMB agar). */
  sheen: number;
};

export const mediums = {
  tcbs: {
    name: "TCBS agar",
    bg: "#06794E",
    ink: "#F6F1DF",
    cell: "#F7EF5C",
    cellEdge: "#E6C81E",
    cellInk: "#05402A",
    nucleus: "#0B5C3D",
    nucleusCore: "#06402A",
    shadow: "#012A1A",
    sheen: 0,
  },
  nutrient: {
    name: "Nutrient agar",
    bg: "#F3EDDC",
    ink: "#0E2A1E",
    cell: "#0B8F5E",
    cellEdge: "#056B45",
    cellInk: "#F3EDDC",
    nucleus: "#F7EF5C",
    nucleusCore: "#E6C81E",
    shadow: "#7A6F4C",
    sheen: 0,
  },
  emb: {
    name: "EMB agar",
    bg: "#1B0B2E",
    ink: "#EFE8FF",
    cell: "#4BE3A0",
    cellEdge: "#18A274",
    cellInk: "#1B0B2E",
    nucleus: "#0E5238",
    nucleusCore: "#083A28",
    shadow: "#05010C",
    sheen: 0.62,
  },
  sheen: {
    name: "EMB agar, green sheen",
    bg: "#4BE3A0",
    ink: "#07261A",
    cell: "#4BE3A0",
    cellEdge: "#18A274",
    cellInk: "#1B0B2E",
    nucleus: "#0E5238",
    nucleusCore: "#083A28",
    shadow: "#05010C",
    sheen: 0,
  },
  blood: {
    name: "Blood agar",
    bg: "#C4122F",
    ink: "#FFEFE3",
    cell: "#FFC9B8",
    cellEdge: "#FF8E6E",
    cellInk: "#5E0615",
    nucleus: "#5E0615",
    nucleusCore: "#3A030D",
    shadow: "#3A030D",
    sheen: 0,
  },
  bromo: {
    name: "Bromothymol blue agar",
    bg: "#1C2BD6",
    ink: "#EEF0FF",
    cell: "#BFF3FF",
    cellEdge: "#7FD8FF",
    cellInk: "#0A1270",
    nucleus: "#0A1270",
    nucleusCore: "#050A45",
    shadow: "#050A45",
    sheen: 0,
  },
  macconkey: {
    name: "MacConkey agar",
    bg: "#FF4FA3",
    ink: "#2B0A2E",
    cell: "#FFE1F0",
    cellEdge: "#FFB3D6",
    cellInk: "#8A0F52",
    nucleus: "#8A0F52",
    nucleusCore: "#5A0735",
    shadow: "#5A0735",
    sheen: 0,
  },
  sabouraud: {
    name: "Sabouraud agar",
    bg: "#DDE45A",
    ink: "#1C2405",
    cell: "#1F3A12",
    cellEdge: "#3F6B1C",
    cellInk: "#DDE45A",
    nucleus: "#DDE45A",
    nucleusCore: "#B9C23A",
    shadow: "#5C6214",
    sheen: 0,
  },
  mannitol: {
    name: "Mannitol salt agar",
    bg: "#F7B500",
    ink: "#1E1405",
    cell: "#FFF3C2",
    cellEdge: "#FFD86B",
    cellInk: "#6A3A00",
    nucleus: "#B85C00",
    nucleusCore: "#6A3A00",
    shadow: "#6A3A00",
    sheen: 0,
  },
  chocolate: {
    name: "Chocolate agar",
    bg: "#3A1F14",
    ink: "#F3E3CF",
    cell: "#E8A15C",
    cellEdge: "#BE6F2F",
    cellInk: "#1E0E08",
    nucleus: "#1E0E08",
    nucleusCore: "#0F0603",
    shadow: "#0F0603",
    sheen: 0,
  },
} satisfies Record<string, Medium>;

export type MediumKey = keyof typeof mediums;

/**
 * On phones the premise's cells sit directly behind running text, so there they are lemon rather than
 * green. Dark type stays fully legible on top of them.
 */
export const nutrientBehindText: Medium = {
  ...mediums.nutrient,
  cell: "#F7EF5C",
  cellEdge: "#E6C81E",
  cellInk: "#0E2A1E",
  nucleus: "#FBF7A6",
  nucleusCore: "#F0DC3A",
  shadow: "#9A8F5C",
};
