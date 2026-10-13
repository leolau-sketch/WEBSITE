from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2]
source = Path(__file__).parent / 'catalog'
target = root / 'frontend' / 'src' / 'assets' / 'catalog'
target.mkdir(parents=True, exist_ok=True)
assets = {
 'warehouse': 'p03-11', 'workshop': 'p03-12', 'showroom': 'p03-13', 'finished-goods': 'p03-14', 'building': 'p04-04',
 'ptfe-fiber': 'p07-14', 'ptfe-fiber-detail': 'p07-17', 'ptfe-monofilament': 'p07-21',
 'ptfe-thread': 'p08-04', 'ptfe-thread-detail': 'p08-10', 'ptfe-rope': 'p09-13', 'ptfe-rope-detail': 'p09-14',
 'ptfe-webbing': 'p10-16', 'ptfe-webbing-detail': 'p10-19', 'ptfe-tubing': 'p10-25',
 'uhmwpe-fiber': 'p12-23', 'uhmwpe-chopped': 'p12-18', 'uhmwpe-fine-braid': 'p13-15',
 'uhmwpe-thread': 'p14-14', 'uhmwpe-thread-detail': 'p14-23', 'uhmwpe-rope': 'p15-16', 'uhmwpe-rope-detail': 'p15-19',
 'uhmwpe-coated': 'p16-15', 'uhmwpe-coated-detail': 'p16-17', 'uhmwpe-webbing': 'p16-23', 'uhmwpe-webbing-detail': 'p16-24',
 'uhmwpe-sleeve': 'p17-12', 'uhmwpe-sleeve-detail': 'p17-14',
 'aramid-staple': 'p19-02', 'aramid-fiber': 'p19-11', 'meta-aramid': 'p20-13', 'para-aramid': 'p20-15',
 'aramid-thread': 'p21-16', 'aramid-thread-detail': 'p21-21', 'steel-aramid-thread': 'p22-01', 'steel-aramid-detail': 'p22-04',
 'aramid-rope': 'p23-15', 'aramid-rope-detail': 'p23-17', 'aramid-webbing': 'p23-22', 'aramid-webbing-detail': 'p23-25',
 'aramid-sleeve': 'p24-15', 'aramid-sleeve-detail': 'p24-20',
}
for name, original in assets.items():
    im=Image.open(source / f'{original}.png').convert('RGB')
    im.thumbnail((1200,1200))
    im.save(target / f'{name}.webp', 'WEBP', quality=86, method=6)
print(f'{len(assets)} WebP assets; {sum(p.stat().st_size for p in target.glob("*.webp"))//1024} KB total')
