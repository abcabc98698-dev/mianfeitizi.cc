from PIL import Image
from pathlib import Path
import json, shutil

ROOT = Path(r"C:\Users\Pro User\Desktop\mianfeitizi.cc")
PUBLIC = ROOT / "docs" / "public" / "airports"
EVID = PUBLIC / "evidence"
LOGOS = PUBLIC / "logos"
EVID.mkdir(parents=True, exist_ok=True)
LOGOS.mkdir(parents=True, exist_ok=True)

speed_map = {
    "sogo": ("SOGO云-节点测速实测.png", "SOGO云"),
    "u1s1": ("U1S1-节点测速实测.png", "U1S1"),
    "yifan": ("一翻云-节点测速实测.png", "一翻云"),
    "ermao": ("二猫云-节点测速实测.png", "二猫云"),
    "guangnian": ("光年梯-节点测速实测.png", "光年梯"),
    "guangsuyun": ("光速云-节点测速实测.png", "光速云"),
    "quanqiu": ("全球云-节点测速实测.png", "全球云"),
    "kexin": ("可信云-节点测速实测.png", "可信云"),
    "weitu": ("唯兔云-节点测速实测.png", "唯兔云"),
    "yuzhou": ("宇宙云-节点测速实测.png", "宇宙云"),
    "muguang": ("幕光加速-节点测速实测.png", "幕光加速"),
    "weifeng": ("微风-节点测速实测.png", "微风网络"),
    "xingdaomeng": ("星岛梦-节点测速实测.png", "星岛梦"),
    "jilian": ("极连云-节点测速实测.png", "极连云"),
    "lingmao": ("灵猫网络-节点测速实测.png", "灵猫网络"),
    "sujie": ("速界-节点测速实测.png", "速界"),
    "feimao": ("飞猫云-节点测速实测.png", "飞猫云"),
}

manifest = json.loads(Path(r"C:\Users\Pro User\Desktop\机场品牌信息\extracted\speedtest-manifest.json").read_text(encoding="utf-8"))
tested = {a["brand"]: a["testedAt"][:10] for a in manifest["assets"]}

images = {}
for slug, (filename, label) in speed_map.items():
    src = Path(r"C:\Users\Pro User\Desktop\机场品牌信息\extracted") / filename
    dst = EVID / f"{slug}-2026-08-11.webp"
    Image.open(src).convert("RGB").save(dst, "WEBP", quality=90, method=6)
    images.setdefault(slug, {"speedtest": [], "unlock": []})
    date = tested.get(label, "2026-08-11")
    images[slug]["speedtest"].append({
        "src": f"/airports/evidence/{dst.name}",
        "alt": f"{label} 2026-08-11 节点测速截图，包含节点地区、协议、延迟和速度结果。",
        "caption": f"{label}节点测速截图。测试批次 2026-08-11，图内数值未改写；仅代表截图所示时间与线路，不代表长期表现。",
        "date": date,
        "dateNote": "图片内测试时间；部分品牌日期为批次记录" if label in ("幕光加速", "微风网络") else "图片内测试时间",
        "source": "本站保留的 2026-08-11 测速截图（WebP 展示副本）",
        "kind": "speedtest",
    })

extra = Path(r"C:\Users\Pro User\Desktop\光速云测试图解锁图")
extra_files = [
    ("photo_2026-08-19_12-13-01.jpg", "speedtest", "节点测速截图（一）"),
    ("photo_2026-08-19_12-13-50.jpg", "speedtest", "节点测速截图（二）"),
    ("photo_2026-08-19_12-13-58.jpg", "speedtest", "节点测速截图（三）"),
    ("photo_2026-08-19_12-18-40.jpg", "unlock", "流媒体与 AI 解锁矩阵"),
    ("photo_2026-08-19_12-20-10.jpg", "speedtest", "节点测速截图（四）"),
]
images.setdefault("guangsuyun", {"speedtest": [], "unlock": []})
for i, (filename, kind, label) in enumerate(extra_files, 1):
    src = extra / filename
    dst = EVID / f"guangsuyun-2026-08-19-{i:02d}.webp"
    Image.open(src).convert("RGB").save(dst, "WEBP", quality=90, method=6)
    item = {
        "src": f"/airports/evidence/{dst.name}",
        "alt": f"光速云 {label}，图内测试时间以截图为准。",
        "caption": f"光速云{label}。文件批次 2026-08-19，图内测试时间与结果未改写；仅代表截图所示批次，不代表当前可用性或长期表现。",
        "date": "2026-08-19",
        "dateNote": "文件批次；图内测试时间以截图为准",
        "source": "用户提供的原始截图",
        "kind": kind,
    }
    images["guangsuyun"][kind].append(item)

logos = {
    "guangsuyun": "光速云主图.png",
    "feimao": "飞猫云主图.png",
    "quanqiu": "全球云主图.png",
    "jilian": "极连云主图.png",
    "guangnian": "光年梯主图.png",
    "tiziyun": "梯子云256x256.png",
    "lingdongyun": "灵动云256x256.png",
    "yinxingren": "隐形人256x256.png",
    "u1s1": "u1s1主图.png",
    "sogo": "sogo.webp",
    "sujie": "sujie_logo.webp",
    "xingdaomeng": "xdm_logo.webp",
    "yuzhou": "yuzhou_logo.webp",
    "ermao": "2mao_logo.webp",
    "longmaoyun": "totoro.webp",
    "qingyunti": "qyt_logo.webp",
    "tntcloud": "TNT.webp",
    "edgenova": "edgenova_logo.webp",
    "flyingbird": "flyingbird.webp",
}
logo_dir = Path(r"C:\Users\Pro User\Desktop\logos")
for slug, filename in logos.items():
    src = logo_dir / filename
    if not src.exists():
        print("missing logo", src)
        continue
    try:
        im = Image.open(src).convert("RGBA")
        im.thumbnail((160, 160), Image.LANCZOS)
        canvas = Image.new("RGBA", (160, 160), (0, 0, 0, 0))
        canvas.alpha_composite(im, ((160 - im.width) // 2, (160 - im.height) // 2))
        dst = LOGOS / f"{slug}.webp"
        canvas.save(dst, "WEBP", quality=86, method=6)
        images.setdefault(slug, {"speedtest": [], "unlock": []})
    except Exception as exc:
        print("logo failed", slug, exc)

(ROOT / "docs/.vitepress/data/airport-images.json").write_text(json.dumps(images, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("image brands", len(images), "files", len(list(EVID.glob("*"))), "logos", len(list(LOGOS.glob("*"))))
