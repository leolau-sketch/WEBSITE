from pathlib import Path
import fitz
from PIL import Image, ImageDraw
import subprocess

source = Path(r'E:\shengxin\Dongguan_Shengxin_High_Performance_Fibers_and_Ropes_Catalog_2026 (2).pdf')
out = Path(__file__).parent / 'catalog'
out.mkdir(parents=True, exist_ok=True)
poppler = r'C:\Users\73190\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe'
if not (out / 'page-24.png').exists():
    subprocess.run([poppler, '-scale-to', '950', '-png', str(source), str(out / 'page')], check=True)
pages = sorted(out.glob('page-*.png'))
sheet = Image.new('RGB', (1200, 6 * 320), 'white')
draw = ImageDraw.Draw(sheet)
for i, file in enumerate(pages):
    im = Image.open(file); im.thumbnail((290, 288))
    x, y = (i % 4) * 300, (i // 4) * 320
    sheet.paste(im, (x, y + 25)); draw.text((x + 10, y + 5), f'PDF PAGE {i + 1}', fill='black')
sheet.save(out / 'pages.jpg')
reader = fitz.open(source)
inventory = []
for page_no, page in enumerate(reader, 1):
    for i, img in enumerate(page.get_images(full=True)):
        name = f'p{page_no:02d}-{i:02d}'
        import io
        im = Image.open(io.BytesIO(reader.extract_image(img[0])['image'])).convert('RGB')
        if im.width < 150 or im.height < 100:
            continue
        im.thumbnail((1800, 1800))
        im.save(out / f'{name}.png')
        inventory.append((name, im.copy()))
sheet = Image.new('RGB', (1200, ((len(inventory)+5)//6) * 160), '#e9edf0')
draw = ImageDraw.Draw(sheet)
for i, (name, im) in enumerate(inventory):
    w,h=im.size; im.thumbnail((190, 125))
    x,y=(i%6)*200,(i//6)*160
    sheet.paste(im,(x,y+25)); draw.text((x+3,y+3),f'{name} {w}x{h}',fill='black')
sheet.save(out / 'images.jpg')
for start in range(0,len(inventory),36):
    part = Image.new('RGB',(1200,960),'#e9edf0')
    draw = ImageDraw.Draw(part)
    for j,(name,im) in enumerate(inventory[start:start+36]):
        im=im.copy(); im.thumbnail((190,125)); x,y=(j%6)*200,(j//6)*160
        part.paste(im,(x,y+25)); draw.text((x+3,y+3),name,fill='black')
    part.save(out / f'images-{start//36}.jpg')
print('Extracted',len(inventory),'images')
