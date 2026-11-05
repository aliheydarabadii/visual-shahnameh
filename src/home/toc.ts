/** Shape of src/content/toc.json, built by scripts/build_toc.py from the text. */
export interface Toc {
  /** The book's traditional ages, in order. */
  eras: { id: string; title: string; en: string }[];
  chapters: {
    id: string;
    title: string;
    en: string;
    era: string;
    /** [id, title, couplet count] */
    sections: [string, string, number][];
  }[];
}
