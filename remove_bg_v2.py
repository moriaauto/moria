"""
Remove background do logo Moriá usando:
  1. BFS a partir das bordas (remove fundo externo)
  2. Color-distance global (remove bolsões internos fechados - buraco das letras, pneu)
"""
from PIL import Image
import numpy as np
from collections import deque

INPUT  = r"artifacts\moria-auto-eletrica\public\moria-logo.jpeg"
OUTPUT = r"artifacts\moria-auto-eletrica\public\moria-logo-clean.png"

img = Image.open(INPUT).convert("RGBA")
data = np.array(img, dtype=np.float32)  # H x W x 4

# Sample background color from corner
bg = data[2, 2, :3]
print(f"BG colour: R={bg[0]:.0f} G={bg[1]:.0f} B={bg[2]:.0f}")

rgb = data[:, :, :3]
H, W = rgb.shape[:2]

# Euclidean distance to background colour
dist = np.sqrt(np.sum((rgb - bg) ** 2, axis=2))  # H x W

# ---- Pass 1: BFS from border ----
BFS_THRESH = 50.0
is_bg = np.zeros((H, W), dtype=bool)

queue = deque()
def try_enqueue(x, y):
    if 0 <= x < W and 0 <= y < H and not is_bg[y, x] and dist[y, x] < BFS_THRESH:
        is_bg[y, x] = True
        queue.append((x, y))

# Seed borders
for x in range(W):
    try_enqueue(x, 0); try_enqueue(x, H - 1)
for y in range(H):
    try_enqueue(0, y); try_enqueue(W - 1, y)

while queue:
    x, y = queue.popleft()
    for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
        try_enqueue(x + dx, y + dy)

# ---- Pass 2: global colour-distance for enclosed pockets ----
# Catches wheel interior and letter holes (O, A)
GLOBAL_THRESH = 60.0
global_match = dist < GLOBAL_THRESH

mask_transparent = is_bg | global_match  # True = make transparent

# Apply: set alpha to 0 where transparent
result = np.array(img)
result[mask_transparent, 3] = 0

out_img = Image.fromarray(result, "RGBA")
out_img.save(OUTPUT)
print(f"Saved → {OUTPUT}  ({W}x{H})")
