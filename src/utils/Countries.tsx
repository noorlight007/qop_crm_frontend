import { getData } from "country-list";

export const countries = getData()
  .map(({ code, name }) => {
    let display = name;
    // tidy up a couple of entries we care about
    if (code === "GB") {
      display = "United Kingdom";
    }
    // remove trailing " (the)" from names
    display = display.replace(/\s*\(the\)$/i, "");
    return { code, name: display };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export type Country = (typeof countries)[number];
