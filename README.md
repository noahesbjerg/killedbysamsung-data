# Killed by Samsung

The public catalogue for [Killed by Samsung](https://killedbysamsung.com). Each entry documents a product, service or feature that Samsung retired, or announced it would retire.

[Suggest an entry or correction](https://github.com/noahesbjerg/killedbysamsung-data/issues/new?template=entry.yml) with the product name and a source, or [edit the catalogue](catalogue.json) and open a pull request.

## Contributions

1. Search the catalogue for the product and its former names. Include distinct features, services, platforms or hardware with a documented retirement. Routine model refreshes are outside the catalogue.
2. Prefer a Samsung or partner notice. If the original notice is unavailable, link a reliable report that quotes it. Specify the country, devices and feature affected. Distinguish the end of downloads, support, production or actual operation.
3. In a pull request, add or edit one object in `catalogue.json`. Keep existing IDs stable. Use plain text and keep descriptions to one or two sentences. Entries are kept alphabetically by ID for easier editing.
4. Run `node validate.mjs` with Node 22 or newer. A maintainer checks the evidence before merging. Accepted edits trigger a rebuild of the public site.

| Field | Format |
| --- | --- |
| `id`, `name` | A unique lowercase hyphenated ID and the product or feature name. |
| `category` | App, Feature, Hardware, Platform or Service. |
| `status` | `announced` or `discontinued`. Verify the closure before changing the status, including after an announced date passes. |
| `endDate`, optional `startDate` | Use YYYY, YYYY-MM or YYYY-MM-DD. Use only the precision the sources support. For phased retirements, name the milestone and any exceptions in the description. |
| `description` | Briefly explain what people used and what ended. |
| `sources` | A nonempty list of objects with a descriptive `label` and an HTTPS `url`. Put the clearest retirement source first and cite any start date you include. |
