"""Extract the twelve embedded catalog images selected by the user, without retouching.

Source is read-only. This script is not part of the website runtime.
"""
from pathlib import Path
from io import BytesIO
from PIL import Image
import pymupdf

SOURCE = Path(r'E:/shengxin/Dongguan_Shengxin_High_Performance_Fibers_and_Ropes_Catalog_2026 (2).pdf')
DESTINATION = Path(__file__).resolve().parents[1] / 'src/assets/applications'
IMAGES = {
    'textile': (8, 2208), 'pharmaceutical': (8, 2213), 'food': (8, 2218),
    'refining': (9, 2276), 'dye': (9, 2280), 'aerospace': (9, 2284),
    'occupational': (10, 2347), 'marine': (10, 2351), 'electroplating': (10, 2358),
    'protection': (12, 2511), 'aquaculture': (12, 2515), 'automotive': (12, 2519),
}

if __name__ == '__main__':
    DESTINATION.mkdir(parents=True, exist_ok=True)
    with pymupdf.open(SOURCE) as document:
        for name, (page, xref) in IMAGES.items():
            assert any(image['xref'] == xref for image in document[page-1].get_image_info(xrefs=True))
            image = document.extract_image(xref)
            output = DESTINATION / f'{name}.webp'
            # Web asset encoding only: no cropping, retouching or synthetic imagery.
            with Image.open(BytesIO(image['image'])) as source_image:
                source_image.convert('RGB').save(output, 'WEBP', quality=88, method=6)
            print(f'{output.name}: PDF page {page}, {image["width"]} x {image["height"]}')
