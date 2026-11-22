# Gera img/og.jpg (imagem de pré-visualização do link no Instagram/WhatsApp/anúncios)
import sys
from PIL import Image, ImageDraw, ImageFont
out = sys.argv[1]
W, H = 1200, 630
im = Image.new('RGB', (W, H), '#1B1F57'); d = ImageDraw.Draw(im)
logo = Image.open(f'{out}/img/logo.png').convert('RGBA'); lw = 438
logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
im.paste(logo, ((W - lw) // 2, 150), logo); y = 150 + logo.height + 44
d.rectangle([W // 2 - 60, y, W // 2 + 60, y + 2], fill='#C4A058')
F = '/usr/share/fonts/truetype/liberation/'
sans = ImageFont.truetype(F + 'LiberationSans-Regular.ttf', 32)
bold = ImageFont.truetype(F + 'LiberationSans-Bold.ttf', 26)
for t, f, c, dy in [('Direito do Trabalho · Penal · Imobiliário · Civil', sans, '#F4F1E8', 40),
                    ('TATUAPÉ · SÃO PAULO', bold, '#C4A058', 104)]:
    w = d.textlength(t, font=f); d.text(((W - w) / 2, y + dy), t, font=f, fill=c)
d.rectangle([0, H - 10, W, H], fill='#C4A058')
im.save(f'{out}/img/og.jpg', 'JPEG', quality=80, optimize=True)
