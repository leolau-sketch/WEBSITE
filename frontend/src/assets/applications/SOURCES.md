# Application illustration provenance

The user explicitly requested these twelve scenes on 2026-09-30 and supplied four screenshot strips. The matching embedded images were extracted from the user's `Dongguan_Shengxin_High_Performance_Fibers_and_Ropes_Catalog_2026 (2).pdf`, not from the reference website.

- PDF page 8: textile, pharmaceutical, food.
- PDF page 9: refining, dye, aerospace.
- PDF page 10: occupational, marine, electroplating.
- PDF page 12: protection, aquaculture, automotive.

`frontend/scripts/extract-application-images.py` records exact PDF image references and exports WebP versions, without retouching or cropping. Original PDF and user uploads are unchanged. Twelve runtime WebP images total 360,710 bytes. PNG/JPEG extraction intermediates and screenshot copies are not bundled; `scenario-images.js` imports only WebP.

These are application illustrations, not evidence of Shengxin customer projects, certifications, medical approvals, aerospace qualification or ballistic performance. User provision is not independent evidence of a commercial image license: verify rights before public deployment. No assertion of ownership of third-party photography is made.
