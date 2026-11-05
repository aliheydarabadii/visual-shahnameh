import { LIGHT_LAYER, sectionArt } from "../art";
import type { Section } from "../types";

/**
 * 07.13 · فریدون → آگاه شدن سلم و تور از پادشاهی منوچهر فرستادن پیام به نزد
 * Couplets: text/shahnameh.json, section 07.13. The source heading has none.
 * One threshold painting. The painting-count warning is intentional.
 * Paintings: art/prompts/07-13.md.
 */
const art = sectionArt("07.13");

export const section: Section = {
  id: "07.13",
  chapter: { id: "07", title: "فریدون" },
  title: "آگاه شدن سلم و تور از پادشاهی منوچهر فرستادن پیام به نزد",
  couplets: [

  ],
  scenes: [
    {
      image: art("00-agahi"),
      sound: "threshold",
      alt: "سلم و تور در خیمه‌ی ابریشم، و چراغی میانشان که خبر پادشاهی است",
      couplets: [],
    },
  ],
  lightLayer: LIGHT_LAYER,
};
