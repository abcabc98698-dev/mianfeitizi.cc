from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "docs" / "public"
PUBLIC.mkdir(exist_ok=True)

W, H = 1200, 630
BG = "#07110e"
MINT = "#5eead4"
AMBER = "#fbbf24"
PAPER = "#f3faf6"
MUTED = "#8aa79a"
LINE = "#1d352c"

font_regular = "C:/Windows/Fonts/msyh.ttc"
font_bold = "C:/Windows/Fonts/msyhbd.ttc"


def font(size, bold=False):
    return ImageFont.truetype(font_bold if bold else font_regular, size)


image = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(image)

# grid
for x in range(0, W, 60):
    draw.line([(x, 0), (x, H)], fill="#0e211a", width=1)
for y in range(0, H, 60):
    draw.line([(0, y), (W, y)], fill="#0e211a", width=1)

# soft glow
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gdraw = ImageDraw.Draw(glow)
gdraw.ellipse((760, -180, 1380, 360), fill=(20, 180, 135, 55))
gdraw.ellipse((-260, 420, 420, 900), fill=(180, 83, 9, 38))
glow = glow.filter(ImageFilter.GaussianBlur(90))
image = Image.alpha_composite(image.convert("RGBA"), glow).convert("RGB")
draw = ImageDraw.Draw(image)

# top brand row
draw.rectangle((64, 58, 74, 68), fill=MINT)
draw.text((88, 54), "MIANFEITIZI.CC", font=font(24, True), fill=PAPER)
draw.text((88, 88), "VERIFY FIRST / 2026", font=font(19), fill=MUTED)

# main title
draw.text((64, 160), "免费梯子，", font=font(92, True), fill=PAPER)
draw.text((64, 272), "先核验，再用。", font=font(92, True), fill=MINT)

# subtitle
subtitle = "免费机场 · 免费节点 · 低预算方案"
draw.text((68, 410), subtitle, font=font(30), fill=MUTED)

# rule
draw.line([(64, 478), (1136, 478)], fill=LINE, width=2)

# status block
draw.text((64, 510), "0", font=font(58, True), fill=AMBER)
draw.text((112, 516), "条合格免费资源", font=font(27, True), fill=PAPER)
draw.text((112, 556), "审核 2026-10-24  ·  下次复核 2026-11-07", font=font(20), fill=MUTED)

# right badge
badge = "ZERO RESULT"
bw = draw.textlength(badge, font=font(18, True))
draw.rectangle((1136 - bw - 36, 56, 1136, 96), outline=AMBER, width=2)
draw.text((1136 - bw - 18, 66), badge, font=font(18, True), fill=AMBER)

# bottom mark
draw.text((64, 594), "只发布可复核的信息", font=font(17), fill="#638276")
draw.text((1000, 594), "mianfeitizi.cc", font=font(17, True), fill=MINT)

image.save(PUBLIC / "og-default.png", optimize=True)
print("wrote", PUBLIC / "og-default.png")

# Apple touch icon
icon = Image.new("RGB", (180, 180), BG)
idraw = ImageDraw.Draw(icon)
idraw.rounded_rectangle((6, 6, 174, 174), radius=30, fill=BG, outline="#2f5c4c", width=2)
for i, (x, top) in enumerate([(44, 78), (82, 102), (120, 48)]):
    idraw.rectangle((x, top, x + 12, 138), fill=MINT)
idraw.ellipse((126, 38, 142, 54), fill=AMBER)
icon.save(PUBLIC / "apple-touch-icon.png", optimize=True)
print("wrote", PUBLIC / "apple-touch-icon.png")
