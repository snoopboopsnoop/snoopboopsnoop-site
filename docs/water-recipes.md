# Water recipes

Open `/coffee/water` from the coffee hub or brew journal to save concentrate batches. Each batch records a mineral, ppm added by one drop in a reference volume, unit basis, optional date, and notes. Multiple batches per mineral are supported. Archive finished bottles and restore them as needed.

The confirmed calibrations are magnesium sulfate 4.74 GH, calcium chloride 4.10 GH, and sodium bicarbonate 1.25 KH ppm/drop in 300 mL, all as CaCO₃. These are shown as placeholders, not saved bottles. GH/KH as CaCO₃ is selected by default and needs no ion conversion. For other batches, you can choose Mg²⁺, Ca²⁺, or HCO₃⁻ ion ppm instead. Whole-salt ppm and stock-bottle ppm are not interchangeable with these inputs.

Enable **Log a water recipe** in Add brew or Edit brew. Select a bottle and enter whole drops for each mineral. The concentrate manager opens in another tab to preserve your brew form; use **Refresh shelf** after adding a bottle.

- **Pre-brew:** enter all the water mineralized in the kettle, including unused water. Total water poured remains a separate brew field.
- **Post-brew:** enter the cup yield receiving the drops. Cup weight in grams is a practical approximation of mL.
- **Base water:** record the source and optionally measured GH/KH before additions. Enter zero for a demineralized base. Blank values remain unknown, so the summary shows added GH/KH rather than assuming zero.

Each brew stores a copy of its selected bottle calibration. Editing or archiving the shelf bottle does not rewrite historical brews. When editing a brew whose calibration differs from the shelf, the selector shows its saved calibration. Explicitly select an updated batch to use the new calibration.

## Calculation

For each mineral: `ppm/drop × drops × reference mL ÷ dosed mL`.

Calibrations already expressed as CaCO₃ need no conversion. Ion ppm uses magnesium × 4.118, calcium × 2.497, and bicarbonate × 0.8202. Calcium and magnesium contributions add to GH. Sodium bicarbonate contributes KH, used here to mean alkalinity. Values are shown in ppm as CaCO₃.

Pre-brew totals include independently known base-water values and describe the mixed water before heating/extraction. Post-brew results describe added mineral equivalents per cup volume, not final measured coffee hardness or alkalinity. Extraction, mineral retention, precipitation, and coffee buffering reactions are not modeled. Drop volume is assumed consistent with the bottle's calibration.

References: [Barista Hustle GH/KH explanation](https://www.baristahustle.com/water-hardness/), [USGS hardness calculations](https://pubs.usgs.gov/publication/sir20215119/full), [USGS bicarbonate equivalents](https://pubs.usgs.gov/wri/wri024045/htms/table6.htm).

## Storage and verification

Concentrates use browser localStorage key `snoopboopsnoop-coffee-concentrates`. Water recipes are optional inside existing brew records, so older records need no migration. Data remains local to this browser/origin and is not synchronized or backed up remotely.

Run `npm test` with Node 22.6+ for the calculation, validation, storage, and historical-calibration tests. Run `npm run build` and `npm run lint` for type/build and lint checks. Browser QA covers bottle creation/edit/archive, unit basis handling, saving/editing recipes, journal details, snapshot preservation, post-brew yield, and mobile layout.
