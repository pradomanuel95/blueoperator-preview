(function () {
  var DATA_URL = "assets/weekly/weekly.json?v=1811280412";
  var IMG_DIR = "assets/weekly/";
  var PAGE_SIZE_DESKTOP = 9;
  var PAGE_SIZE_MOBILE = 6;
  var MQ_DESKTOP = window.matchMedia("(min-width: 900px)");
  var currentPage = 1;
  var updatingHash = false;
  var FALLBACK = [
    {
      id: "coral-gables-33146-weekly",
      neighborhood: "Coral Gables",
      zip: "33146",
      specs: ["Chlorine", "About 12,000 gallons", "Sand filter", "Spa"],
      pump: "Single-speed pump",
      photo: "weekly-pool-coral-gables-33146.webp",
      alt: "Clear freeform chlorine pool with a spa and a canal behind it in Coral Gables.",
      width: 1600,
      height: 1600
    },
    {
      id: "homestead-33035-weekly",
      neighborhood: "Homestead",
      zip: "33035",
      specs: ["Saltwater", "About 11,000 gallons", "Cartridge filter"],
      pump: "Variable-speed pump",
      heater: "Heated (heat pump)",
      photo: "weekly-pool-homestead-33035.webp",
      alt: "Clear rectangular saltwater pool with a spillover, pavers, and a covered patio in Homestead.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-b-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Saltwater", "About 8,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      automation: "Jandy automation system",
      heater: "Heated (heat pump)",
      photo: "weekly-pool-kendall-33186-b.webp",
      alt: "Clear rectangular saltwater pool with a white marble deck and a basketball hoop in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Saltwater", "About 12,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      heater: "Heated (heat pump)",
      photo: "weekly-pool-kendall-33186.webp",
      alt: "Clear oval saltwater pool with brick coping and a raised wall with fountains in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33176-c-weekly",
      neighborhood: "Kendall",
      zip: "33176",
      specs: ["Saltwater", "About 45,000 gallons", "Quad cartridge filter"],
      pump: "Variable-speed pump",
      automation: "Pentair automation system",
      heater: "Heated (heat pump)",
      photo: "weekly-pool-kendall-33176-c.webp",
      alt: "Clear freeform saltwater pool with a raised spa, palms, and a white fence in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-c-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Chlorine", "About 10,500 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33186-c.webp",
      alt: "Clear kidney-shaped chlorine pool with a compass-star tile, turtle tiles on the steps, and a brick deck in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "coconut-grove-33133-weekly",
      neighborhood: "Coconut Grove",
      zip: "33133",
      specs: ["Chlorine", "About 6,000 gallons", "Sand filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-coconut-grove-33133.webp",
      alt: "Clear narrow lap-style chlorine pool with a tropical hedge and a suction cleaner in the water in Coconut Grove.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-d-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Chlorine", "About 12,000 gallons", "Cartridge filter"],
      pump: "Variable-speed pump",
      photo: "weekly-pool-kendall-33186-d.webp",
      alt: "Clear freeform chlorine pool with dark tile, a travertine deck, palms, and a suction cleaner in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-e-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Chlorine", "About 11,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33186-e.webp",
      alt: "Clear kidney-shaped chlorine pool with a white fence and a closed umbrella in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-f-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Chlorine", "About 15,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33186-f.webp",
      alt: "Clear kidney-shaped chlorine pool with brick coping and palm shadows in the water in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-lakes-33183-weekly",
      neighborhood: "Kendall Lakes",
      zip: "33183",
      specs: ["Chlorine", "About 11,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-lakes-33183.webp",
      alt: "Clear chlorine pool with brick coping and a shed in Kendall Lakes.",
      width: 1600,
      height: 1600
    },
    {
      id: "west-kendall-33196-weekly",
      neighborhood: "West Kendall",
      zip: "33196",
      specs: ["Saltwater", "About 12,000 gallons", "Cartridge filter"],
      pump: "Variable-speed pump",
      photo: "weekly-pool-west-kendall-33196.webp",
      alt: "Clear rectangular saltwater pool with a sun shelf and a white fence in West Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33176-weekly",
      neighborhood: "Kendall",
      zip: "33176",
      specs: ["Chlorine", "About 11,000 gallons", "Sand filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33176.webp",
      alt: "Clear rectangular chlorine pool with a gray fence and sliding doors in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-lakes-33183-b-weekly",
      neighborhood: "Kendall Lakes",
      zip: "33183",
      specs: ["Chlorine", "About 10,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-lakes-33183-b.webp",
      alt: "Clear kidney-shaped chlorine pool with a tropical hedge and a suction hose in Kendall Lakes.",
      width: 1600,
      height: 1600
    },
    {
      id: "west-kendall-33196-b-weekly",
      neighborhood: "West Kendall",
      zip: "33196",
      specs: ["Chlorine", "About 10,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-west-kendall-33196-b.webp",
      alt: "Clear kidney-shaped chlorine pool with brick coping, a shed, and a wood fence in West Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "westchester-33155-weekly",
      neighborhood: "Westchester",
      zip: "33155",
      specs: ["Chlorine", "About 13,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-westchester-33155.webp",
      alt: "Clear rectangular chlorine pool with dolphin tiles and a vacuum in the water in Westchester.",
      width: 1600,
      height: 1600
    },
    {
      id: "coral-gables-33134-weekly",
      neighborhood: "Coral Gables",
      zip: "33134",
      specs: ["Saltwater", "About 33,000 gallons", "Cartridge filter"],
      pump: "Variable-speed pump",
      photo: "weekly-pool-coral-gables-33134.webp",
      alt: "Clear large rectangular saltwater pool with bright blue water and tree shadows in Coral Gables.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-g-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Chlorine", "About 9,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33186-g.webp",
      alt: "Clear chlorine pool with long steps and tropical plants in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-h-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Chlorine", "About 13,000 gallons", "Cartridge filter", "Spa"],
      pump: "Single-speed pump",
      automation: "Jandy automation system",
      photo: "weekly-pool-kendall-33186-h.webp",
      alt: "Clear freeform chlorine pool with a spa and a technician brushing the water in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "westchester-33155-b-weekly",
      neighborhood: "Westchester",
      zip: "33155",
      specs: ["Chlorine", "About 11,500 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-westchester-33155-b.webp",
      alt: "Clear kidney-shaped chlorine pool with tan coping and a white wall in Westchester.",
      width: 1600,
      height: 1600
    },
    {
      id: "tamiami-33185-weekly",
      neighborhood: "Tamiami",
      zip: "33185",
      specs: ["Saltwater", "About 10,000 gallons", "Cartridge filter"],
      pump: "Variable-speed pump",
      photo: "weekly-pool-tamiami-33185.webp",
      alt: "Clear freeform saltwater pool with lush plants and a rock waterfall in Tamiami.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33176-b-weekly",
      neighborhood: "Kendall",
      zip: "33176",
      specs: ["Chlorine", "About 11,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      heater: "Heated (gas heater)",
      photo: "weekly-pool-kendall-33176-b.webp",
      alt: "Clear kidney-shaped chlorine pool with turtle tiles, a safety fence, and palms in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33176-d-weekly",
      neighborhood: "Kendall",
      zip: "33176",
      specs: ["Chlorine", "About 13,000 gallons", "Sand filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33176-d.webp",
      alt: "Clear rectangular chlorine pool with a suction cleaner and a green patio umbrella in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33176-e-weekly",
      neighborhood: "Kendall",
      zip: "33176",
      specs: ["Chlorine", "About 13,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33176-e.webp",
      alt: "Clear freeform chlorine pool with a safety fence and a striped patio umbrella in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-k-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Chlorine", "About 2,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33186-k.webp",
      alt: "Clear rectangular chlorine pool with a sun shelf and white stone coping in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33176-f-weekly",
      neighborhood: "Kendall",
      zip: "33176",
      specs: ["Chlorine", "About 11,000 gallons", "Sand filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33176-f.webp",
      alt: "Clear rectangular chlorine pool with a suction cleaner and white patio chairs in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-lakes-33183-c-weekly",
      neighborhood: "Kendall Lakes",
      zip: "33183",
      specs: ["Chlorine", "About 15,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-lakes-33183-c.webp",
      alt: "Clear rectangular chlorine pool under a screen enclosure with terracotta tile in Kendall Lakes.",
      width: 1600,
      height: 1600
    },
    {
      id: "tamiami-33185-b-weekly",
      neighborhood: "Tamiami",
      zip: "33185",
      specs: ["Saltwater", "About 4,200 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-tamiami-33185-b.webp",
      alt: "Clear freeform saltwater pool with a paver deck and hedges in Tamiami.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-i-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Chlorine", "About 14,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33186-i.webp",
      alt: "Clear rectangular chlorine pool under a screen enclosure with a light stone deck in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33176-g-weekly",
      neighborhood: "Kendall",
      zip: "33176",
      specs: ["Saltwater", "About 11,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      heater: "Heated (A/C heat recovery)",
      photo: "weekly-pool-kendall-33176-g.webp",
      alt: "Clear rectangular saltwater pool with dolphin tiles, a spa, and a thatched tiki hut in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33173-weekly",
      neighborhood: "Kendall",
      zip: "33173",
      specs: ["Chlorine", "About 12,500 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33173.webp",
      alt: "Clear oval chlorine pool with red brick coping and a covered patio in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-j-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Chlorine", "About 26,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33186-j.webp",
      alt: "Clear rectangular chlorine pool with a lane line and a thatched tiki hut in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "tamiami-33175-weekly",
      neighborhood: "Tamiami",
      zip: "33175",
      specs: ["Chlorine", "About 13,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-tamiami-33175.webp",
      alt: "Clear rectangular chlorine pool with a stone deck and palms in Tamiami.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33176-h-weekly",
      neighborhood: "Kendall",
      zip: "33176",
      specs: ["Chlorine", "About 11,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33176-h.webp",
      alt: "Clear rectangular chlorine pool with a pebble finish under a screen enclosure in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "pinecrest-33156-weekly",
      neighborhood: "Pinecrest",
      zip: "33156",
      specs: ["Chlorine", "About 15,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-pinecrest-33156.webp",
      alt: "Clear rectangular chlorine pool with a spa and a modern white house in Pinecrest.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33176-i-weekly",
      neighborhood: "Kendall",
      zip: "33176",
      specs: ["Saltwater", "About 11,000 gallons", "Cartridge filter"],
      pump: "Variable-speed pump",
      photo: "weekly-pool-kendall-33176-i.webp",
      alt: "Clear freeform saltwater pool with a raised spa and tiled steps in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33176-j-weekly",
      neighborhood: "Kendall",
      zip: "33176",
      specs: ["Chlorine", "About 21,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33176-j.webp",
      alt: "Clear rectangular chlorine pool with brick coping and a palm in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "princeton-33032-weekly",
      neighborhood: "Princeton",
      zip: "33032",
      specs: ["Saltwater", "About 11,000 gallons", "Cartridge filter"],
      pump: "Variable-speed pump",
      heater: "Heated (heat pump)",
      photo: "weekly-pool-princeton-33032.webp",
      alt: "Clear rectangular saltwater pool with a sun shelf and a spa in Princeton.",
      width: 1600,
      height: 1600
    },
    {
      id: "coconut-grove-33133-b-weekly",
      neighborhood: "Coconut Grove",
      zip: "33133",
      specs: ["Chlorine", "About 3,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      heater: "Heated (heat pump)",
      photo: "weekly-pool-coconut-grove-33133-b.webp",
      alt: "Clear rectangular chlorine pool with tiled steps and white lounge chairs in Coconut Grove.",
      width: 1600,
      height: 1600
    },
    {
      id: "west-kendall-33196-c-weekly",
      neighborhood: "West Kendall",
      zip: "33196",
      specs: ["Chlorine", "About 7,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-west-kendall-33196-c.webp",
      alt: "Clear rectangular chlorine pool with brick coping and tiled steps in West Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-lakes-33183-d-weekly",
      neighborhood: "Kendall Lakes",
      zip: "33183",
      specs: ["Saltwater", "About 15,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-lakes-33183-d.webp",
      alt: "Clear freeform saltwater pool with a white stone deck and a vacuum hose in Kendall Lakes.",
      width: 1600,
      height: 1600
    },
    {
      id: "west-kendall-33193-weekly",
      neighborhood: "West Kendall",
      zip: "33193",
      specs: ["Saltwater", "About 8,500 gallons", "Cartridge filter"],
      pump: "Variable-speed pump",
      heater: "Heated (heat pump)",
      photo: "weekly-pool-west-kendall-33193.webp",
      alt: "Clear rectangular saltwater pool with mosaic tile steps and a raised spa in West Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "redland-33187-weekly",
      neighborhood: "Redland",
      zip: "33187",
      specs: ["Chlorine", "About 18,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-redland-33187.webp",
      alt: "Clear freeform chlorine pool with a sun shelf and a beige shed in Redland.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-lakes-33183-e-weekly",
      neighborhood: "Kendall Lakes",
      zip: "33183",
      specs: ["Chlorine", "About 11,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-lakes-33183-e.webp",
      alt: "Clear rectangular chlorine pool with brick coping and a metal handrail in Kendall Lakes.",
      width: 1600,
      height: 1600
    },
    {
      id: "cutler-bay-33157-weekly",
      neighborhood: "Cutler Bay",
      zip: "33157",
      specs: ["Chlorine", "About 15,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-cutler-bay-33157.webp",
      alt: "Clear freeform chlorine pool with flagstone coping and a vacuum hose in Cutler Bay.",
      width: 1600,
      height: 1600
    },
    {
      id: "homestead-33033-weekly",
      neighborhood: "Homestead",
      zip: "33033",
      specs: ["Saltwater", "About 15,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-homestead-33033.webp",
      alt: "Clear rectangular saltwater pool with a volleyball net and a vacuum hose in Homestead.",
      width: 1600,
      height: 1600
    },
    {
      id: "redland-33031-weekly",
      neighborhood: "Redland",
      zip: "33031",
      specs: ["Chlorine", "About 11,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-redland-33031.webp",
      alt: "Clear freeform chlorine pool with beige bullnose coping and a white picket fence in Redland.",
      width: 1600,
      height: 1600
    },
    {
      id: "naranja-33032-weekly",
      neighborhood: "Naranja",
      zip: "33032",
      specs: ["Saltwater", "About 18,000 gallons", "Cartridge filter"],
      pump: "Variable-speed pump",
      photo: "weekly-pool-naranja-33032.webp",
      alt: "Clear rectangular saltwater pool with a mosaic tile sun shelf, in-water stools, and a vacuum in Naranja.",
      width: 1600,
      height: 1600
    },
    {
      id: "cutler-bay-33157-b-weekly",
      neighborhood: "Cutler Bay",
      zip: "33157",
      specs: ["Chlorine", "About 14,000 gallons", "Sand filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-cutler-bay-33157-b.webp",
      alt: "Clear rectangular chlorine pool under a screen enclosure with a white lattice in Cutler Bay.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33186-l-weekly",
      neighborhood: "Kendall",
      zip: "33186",
      specs: ["Chlorine", "About 15,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      heater: "Heated (heat pump)",
      photo: "weekly-pool-kendall-33186-l.webp",
      alt: "Clear freeform chlorine pool with a raised spa, flagstone coping, and a blue shade sail in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "cutler-bay-33189-weekly",
      neighborhood: "Cutler Bay",
      zip: "33189",
      specs: ["Saltwater", "About 9,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-cutler-bay-33189.webp",
      alt: "Clear freeform saltwater pool with a sun shelf and screen enclosure in Cutler Bay.",
      width: 1600,
      height: 1600
    },
    {
      id: "palmetto-bay-33157-weekly",
      neighborhood: "Palmetto Bay",
      zip: "33157",
      specs: ["Saltwater", "About 15,000 gallons", "Cartridge filter"],
      pump: "Variable-speed pump",
      photo: "weekly-pool-palmetto-bay-33157.webp",
      alt: "Clear rectangular saltwater pool with a sun shelf and screen enclosure in Palmetto Bay.",
      width: 1600,
      height: 1600
    },
    {
      id: "west-kendall-33185-weekly",
      neighborhood: "West Kendall",
      zip: "33185",
      specs: ["Chlorine", "About 11,000 gallons", "Cartridge filter"],
      pump: "Dual-speed pump",
      photo: "weekly-pool-west-kendall-33185.webp",
      alt: "Clear freeform chlorine pool with a raised spa, mosaic steps, and a brick deck in West Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-lakes-33183-f-weekly",
      neighborhood: "Kendall Lakes",
      zip: "33183",
      specs: ["Saltwater", "About 13,500 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-lakes-33183-f.webp",
      alt: "Clear rectangular saltwater pool with a mosaic-tile step and lounge chairs in Kendall Lakes.",
      width: 1600,
      height: 1600
    },
    {
      id: "olympia-heights-33155-weekly",
      neighborhood: "Olympia Heights",
      zip: "33155",
      specs: ["Saltwater", "About 7,500 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-olympia-heights-33155.webp",
      alt: "Clear rectangular saltwater pool with a mosaic tile band and a vacuum hose in Olympia Heights.",
      width: 1600,
      height: 1600
    },
    {
      id: "west-kendall-33193-b-weekly",
      neighborhood: "West Kendall",
      zip: "33193",
      specs: ["Chlorine", "About 8,500 gallons", "Quad cartridge filter"],
      pump: "Variable-speed pump",
      photo: "weekly-pool-west-kendall-33193-b.webp",
      alt: "Clear rectangular chlorine pool with blue mosaic tile, a raised spa, and a white deck in West Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "kendall-33176-k-weekly",
      neighborhood: "Kendall",
      zip: "33176",
      specs: ["Chlorine", "About 20,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-kendall-33176-k.webp",
      alt: "Clear rectangular chlorine pool with a stone deck and a white house in Kendall.",
      width: 1600,
      height: 1600
    },
    {
      id: "the-crossings-33186-weekly",
      neighborhood: "The Crossings",
      zip: "33186",
      specs: ["Chlorine", "About 13,000 gallons", "Cartridge filter"],
      pump: "Single-speed pump",
      photo: "weekly-pool-the-crossings-33186.webp",
      alt: "Clear rectangular chlorine pool with travertine coping, a pergola, and a blue umbrella in The Crossings.",
      width: 1600,
      height: 1600
    }
  ];

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function automationLine(v) {
    if (!v) return "";
    v = String(v).trim();
    if (!v) return "";
    if (/automation system$/i.test(v)) return v;
    if (/^automation$/i.test(v) || /^unknown$/i.test(v)) return "Automation system";
    return v + " automation system";
  }

  function heaterLine(v) {
    if (!v) return "";
    v = String(v).trim();
    if (!v) return "";
    if (/^heated\s*\(/i.test(v)) return v;
    if (/heat\s*pump/i.test(v)) return "Heated (heat pump)";
    if (/gas/i.test(v)) return "Heated (gas heater)";
    return v;
  }

  function collectSpecs(item) {
    var specs = (item.specs && item.specs.length) ? item.specs.slice() : [];
    var extras = [];
    if (item.pump) extras.push(item.pump);
    var auto = automationLine(item.automation);
    if (auto) extras.push(auto);
    var heat = heaterLine(item.heater);
    if (heat) extras.push(heat);
    if (!extras.length) return specs;
    var idx = -1;
    for (var i = 0; i < specs.length; i++) {
      if (/filter/i.test(specs[i])) idx = i;
    }
    if (idx >= 0) {
      for (var j = extras.length - 1; j >= 0; j--) specs.splice(idx + 1, 0, extras[j]);
    } else {
      specs = specs.concat(extras);
    }
    return specs;
  }

  function renderPool(pool, index) {
    var src = IMG_DIR + (pool.photo || "");
    var w = pool.width || 1600;
    var h = pool.height || 1600;
    var place = pool.neighborhood || "";
    if (place && pool.zip) place += ", FL " + pool.zip;
    var facts = collectSpecs(pool);
    var title = place
      ? '<h3 class="serviced-pools-place">' + escapeHtml(place) + "</h3>"
      : "";
    var list = facts.length
      ? '<ul class="recent-work-facts">' +
        facts.map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("") +
        "</ul>"
      : "";
    var eager = index < 3
      ? ' loading="eager" fetchpriority="high"'
      : ' loading="lazy"';

    return (
      '<figure class="recent-work-job serviced-pools-card" data-pool-id="' + escapeHtml(pool.id || "") + '">' +
        '<div class="serviced-pools-photo">' +
          '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(pool.alt || "") + '" width="' + w + '" height="' + h + '"' + eager + ' decoding="async">' +
        "</div>" +
        '<figcaption class="recent-work-caption">' +
          title +
          list +
        "</figcaption>" +
      "</figure>"
    );
  }

  function getGrid() {
    return document.getElementById("serviced-pools-grid");
  }

  function getCards() {
    var grid = getGrid();
    if (!grid) return [];
    return Array.prototype.slice.call(grid.querySelectorAll(".serviced-pools-card"));
  }

  function attrInt(el, name, fallback) {
    var n = el && parseInt(el.getAttribute(name), 10);
    return n > 0 ? n : fallback;
  }

  function pageSize() {
    var grid = getGrid();
    if (MQ_DESKTOP.matches) return attrInt(grid, "data-page-size-desktop", PAGE_SIZE_DESKTOP);
    return attrInt(grid, "data-page-size-mobile", PAGE_SIZE_MOBILE);
  }

  function firstVisibleIndex() {
    var cards = getCards();
    for (var i = 0; i < cards.length; i++) {
      if (!cards[i].hidden) return i;
    }
    return Math.max(0, (currentPage - 1) * pageSize());
  }

  function pageCount(n) {
    return Math.max(1, Math.ceil(n / pageSize()));
  }

  function pageFromHash() {
    var h = location.hash || "";
    var m = h.match(/^#serviced-pools(?:-p(\d+))?$/);
    if (!m) return null;
    return m[1] ? parseInt(m[1], 10) : 1;
  }

  function hashForPage(page) {
    return "#serviced-pools-p" + page;
  }

  function pageItems(current, total, mode) {
    var i, items = [];
    if (mode === "full" || total <= 5) {
      for (i = 1; i <= total; i++) items.push(i);
      return items;
    }
    if (mode === "sparse") {
      if (current <= 1 || current >= total) return [1, "\u2026", total];
      return [1, "\u2026", current, "\u2026", total];
    }
    if (current <= 3) {
      items = [1, 2, 3, 4];
      if (total > 5) items.push("\u2026", total);
      else {
        for (i = 5; i <= total; i++) items.push(i);
      }
      return items;
    }
    if (current >= total - 2) {
      return [1, "\u2026", total - 3, total - 2, total - 1, total];
    }
    return [1, "\u2026", current - 1, current, current + 1, "\u2026", total];
  }

  function updatePager(page, total) {
    var nav = document.getElementById("serviced-pools-pager");
    if (!nav) return;
    if (total <= 1) {
      nav.hidden = true;
      nav.innerHTML = "";
      nav.classList.remove("is-compact", "is-tight");
      return;
    }
    nav.hidden = false;
    var chevronPrev = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var chevronNext = '<svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function buttonHtml(n) {
      return '<button type="button" data-page="' + n + '"' +
        (n === page ? ' aria-current="page"' : "") +
        ' aria-label="Page ' + n + (n === page ? ", current page" : "") + '">' + n + "</button>";
    }

    function render(items) {
      var html = '<button type="button" data-page="prev" aria-label="Previous page"' +
        (page === 1 ? " disabled" : "") + ">" + chevronPrev + "</button>";
      for (var i = 0; i < items.length; i++) {
        if (items[i] === "\u2026") {
          html += '<span class="pager-ellipsis" aria-hidden="true">\u2026</span>';
        } else {
          html += buttonHtml(items[i]);
        }
      }
      html += '<button type="button" data-page="next" aria-label="Next page"' +
        (page === total ? " disabled" : "") + ">" + chevronNext + "</button>";
      nav.innerHTML = html;
    }

    function overflowed() {
      var avail = nav.parentElement ? nav.parentElement.clientWidth : nav.clientWidth;
      return nav.scrollWidth > avail + 1;
    }

    nav.classList.remove("is-compact", "is-tight");
    var items = pageItems(page, total, total <= 5 ? "full" : "window");
    if (total >= 6) nav.classList.add("is-compact");
    render(items);
    if (overflowed()) {
      nav.classList.add("is-compact", "is-tight");
      render(items);
    }
    if (overflowed() && total >= 6) {
      items = pageItems(page, total, "sparse");
      render(items);
    }
  }

  function applyPage(page, opts) {
    opts = opts || {};
    var grid = getGrid();
    var cards = getCards();
    if (!grid || !cards.length) return;
    var total = pageCount(cards.length);
    if (page < 1) page = 1;
    if (page > total) page = total;
    currentPage = page;
    var size = pageSize();
    cards.forEach(function (card, i) {
      var on = Math.floor(i / size) === (page - 1);
      card.hidden = !on;
      var img = card.querySelector("img");
      if (img && on) img.loading = "eager";
    });
    grid.setAttribute("data-page", String(page));
    grid.setAttribute("data-page-size", String(size));
    grid.setAttribute("data-count", String(cards.length));
    updatePager(page, total);

    if (opts.focus) {
      var heading = document.getElementById("serviced-pools-title");
      if (heading) {
        if (!heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
        try { heading.focus({ preventScroll: true }); } catch (err) { heading.focus(); }
      }
    }
    if (opts.scroll) {
      var section = document.getElementById("serviced-pools");
      if (section) section.scrollIntoView({ behavior: opts.instant ? "auto" : "smooth", block: "start" });
    }

    if (opts.hash) {
      var nextHash = hashForPage(page);
      if (location.hash !== nextHash) {
        updatingHash = true;
        if (opts.replace) history.replaceState({ weeklyPage: page }, "", nextHash);
        else history.pushState({ weeklyPage: page }, "", nextHash);
        updatingHash = false;
      }
    }
  }

  function mount(pools) {
    var grid = getGrid();
    if (!grid || !pools || !pools.length) return;
    grid.innerHTML = pools.map(function (pool, i) { return renderPool(pool, i); }).join("");
    grid.setAttribute("data-count", String(pools.length));
  }

  function bindPager() {
    var nav = document.getElementById("serviced-pools-pager");
    if (!nav || nav.getAttribute("data-bound") === "1") return;
    nav.setAttribute("data-bound", "1");
    nav.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn || btn.disabled || nav.contains(btn) === false) return;
      var t = btn.getAttribute("data-page");
      var page = t === "prev" ? currentPage - 1 : t === "next" ? currentPage + 1 : parseInt(t, 10);
      if (!page) return;
      applyPage(page, { scroll: true, focus: true, hash: true });
    });
  }

  function onHashNav() {
    if (updatingHash) return;
    var p = pageFromHash();
    if (p == null) {
      applyPage(1, { scroll: false, focus: false, hash: false });
      return;
    }
    applyPage(p, { scroll: true, focus: false, hash: false });
  }

  function onBreakpointChange() {
    var first = firstVisibleIndex();
    var size = pageSize();
    var page = Math.floor(first / size) + 1;
    var hasWeeklyHash = /^#serviced-pools(?:-p\d+)?$/.test(location.hash || "");
    applyPage(page, { scroll: false, hash: hasWeeklyHash, replace: true });
  }

  function start() {
    var grid = getGrid();
    if (!grid) return;
    var imgDir = grid.getAttribute("data-img-dir");
    if (imgDir) IMG_DIR = imgDir;

    if (!getCards().length) {
      mount(FALLBACK);
    }

    bindPager();
    window.addEventListener("popstate", onHashNav);
    window.addEventListener("hashchange", onHashNav);
    if (MQ_DESKTOP.addEventListener) MQ_DESKTOP.addEventListener("change", onBreakpointChange);
    else if (MQ_DESKTOP.addListener) MQ_DESKTOP.addListener(onBreakpointChange);

    var resizeTimer = null;
    window.addEventListener("resize", function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var cards = getCards();
        if (!cards.length) return;
        updatePager(currentPage, pageCount(cards.length));
      }, 120);
    });

    var fromHash = pageFromHash();
    applyPage(fromHash || 1, {
      scroll: fromHash != null,
      focus: false,
      hash: false,
      instant: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
