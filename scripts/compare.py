"""Create review sheets from local references and captured application frames.
Optional tooling: Python 3, Pillow, ffmpeg. No output is used by the application.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import subprocess
import shutil

root = Path(__file__).resolve().parents[1]
review = root / 'docs/review'
raw = review / 'raw'
times = [5, 7.1, 9.15, 11.2, 13.25, 15.3, 17.35, 19.4, 21.45, 23.5,
         25.55, 27.6, 29.65, 31.7, 33.75, 35.8, 37.85, 39.9, 41.95, 44]

def pair(reference, implementation, label):
    image = Image.new('RGB', (1280, 386), '#ede7db')
    image.paste(Image.open(reference).convert('RGB').resize((640, 360)), (0, 26))
    image.paste(Image.open(implementation).convert('RGB').resize((640, 360)), (640, 26))
    draw = ImageDraw.Draw(image)
    draw.text((12, 7), f'{label} | REFERENCE', fill='#272722')
    draw.text((652, 7), 'IMPLEMENTATION', fill='#272722')
    return image

for group in range(4):
    sheet = Image.new('RGB', (1280, 386 * 5))
    for row in range(5):
        i = group * 5 + row
        sheet.paste(pair(root / f'docs/reference/style-{i+1:02}.jpg',
                         raw / f't-{times[i]:.2f}.png', f'{i+1:02} @ {times[i]:.2f}s'), (0, row * 386))
    sheet.save(review / f'styles-{group+1}.jpg', quality=90)

for category, moments in [('intro', [1, 2, 3]), ('transitions', [6.2, 10.3, 32.8, 36.9, 41, 43.1]),
                          ('reassembly', [46, 46.5, 47, 48, 50])]:
    sheet = Image.new('RGB', (1280, 386 * len(moments)))
    for row, time in enumerate(moments):
        reference = raw / f'ref-{time:.2f}.png'
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(time), '-i',
                        str(root / 'P-Qyt6vo6pxQ4r0H.mp4'), '-frames:v', '1', str(reference)], check=True)
        sheet.paste(pair(reference, raw / f't-{time:.2f}.png', f'{time:.2f}s'), (0, row * 386))
    sheet.save(review / f'{category}.jpg', quality=90)

shutil.copyfile(raw / 't-50.00.png', review / 'overview-50.png')
shutil.copyfile(raw / 't-31.70.png', review / 'neon.png')
# Dense strips preserve the recorded temporal order for reviewing actual playback.
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(review / 'playback.webm'),
                '-vf', 'fps=2,scale=256:144,tile=8x14', '-frames:v', '1',
                str(review / 'playback-contact.jpg')], check=True)
print('Created 20 style comparisons, introduction, six boundaries, reassembly and playback contact sheet.')
