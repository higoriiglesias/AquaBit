import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options

URL = "http://127.0.0.1:8777/aquario.html"
results = []


def check(name, cond, extra=""):
    results.append(("OK  " if cond else "FAIL") + "  " + name + (("  -> " + str(extra)) if extra else ""))


o = Options()
o.add_argument("--headless=new")
o.add_argument("--window-size=1440,900")
d = webdriver.Edge(options=o)
d.set_window_size(1440, 900)
d.get(URL)
d.execute_script("localStorage.clear()")
d.get(URL)
time.sleep(0.4)

# tank action -> minigame picker -> bubbles game
d.find_element(By.ID, "actGame").click()
time.sleep(0.4)
check("seletor de minijogo abre", d.find_element(By.ID, "pickGameModal").get_attribute("class").find("open") >= 0)
d.find_element(By.ID, "pickBubbles").click()
time.sleep(0.4)
check("minijogo abre", d.find_element(By.ID, "gameModal").get_attribute("class").find("open") >= 0)

coins0 = d.execute_script("return state.coins")
d.find_element(By.ID, "gameStart").click()
time.sleep(0.9)
bubbles = d.find_elements(By.CSS_SELECTOR, ".game-bubble")
check("bolhas aparecem", len(bubbles) > 0, len(bubbles))
check("bolha usa sprite de moeda", len(d.find_elements(By.CSS_SELECTOR, ".game-bubble .coin-lg")) > 0)

for b in bubbles[:3]:
    try:
        b.click()
    except Exception:
        d.execute_script("arguments[0].click(); return 1", b)
time.sleep(0.3)
score = d.execute_script("return gameScore")
check("estourar bolha soma pontos", score >= 5, score)

# fast-forward the timer
d.execute_script("gameTimeLeft = 1; return 1")
time.sleep(1.6)
check("fim de jogo devolve moedas", d.execute_script("return state.coins") == coins0 + score,
      (d.execute_script("return state.coins"), coins0, score))
check("contador de jogos", d.execute_script("return state.stats.games") == 1)
check("botao vira jogar novamente",
      "NOVAMENTE" in d.find_element(By.ID, "gameStart").text, d.find_element(By.ID, "gameStart").text)
d.save_screenshot("_game_end.png")

# achievement unlocks
d.execute_script("openView('achiev'); return 1")
time.sleep(0.4)
d.save_screenshot("_achiev_after.png")
ach = d.execute_script("return [...document.querySelectorAll('.achiev-item')].map(e => (e.classList.contains('locked') ? 'locked' : 'done') + '|' + e.querySelector('.ri-name').textContent.trim())")
check("conquista Jogador desbloqueada", "done|Jogador" in ach, ach)

# fresh shop header
d.execute_script("localStorage.clear(); return 1")
d.get(URL)
time.sleep(0.4)
d.execute_script("state.tankType='fresh'; state.water.temp=24; state.water.ph=7.2; save(); renderAll(); openView('shop'); return 1")
time.sleep(0.3)
txt = d.find_element(By.CLASS_NAME, "overlay-sheet").text
check("loja de agua doce mostra OVOS - AGUA DOCE", "ÁGUA DOCE" in txt)
check("loja nao mostra agua salgada", "SALGADA" not in txt)
d.find_element(By.CSS_SELECTOR, "[data-egg-info='common']").click()
time.sleep(0.2)
egg_info = d.find_element(By.ID, "eggInfoModal")
check("botao de informacoes abre modal do ovo", "open" in egg_info.get_attribute("class"))
egg_rows = egg_info.find_elements(By.CSS_SELECTOR, ".egg-odds-item")
check("modal lista peixes, imagens e chances", len(egg_rows) == 3 and all(
    row.find_element(By.TAG_NAME, "img").get_attribute("src")
    and row.find_element(By.CLASS_NAME, "egg-odds-chance").text == "33.3%"
    for row in egg_rows), len(egg_rows))
d.find_element(By.ID, "eggInfoClose").click()

# mobile overflow check for overlays
d.set_window_size(390, 844)
time.sleep(0.5)
d.execute_script("closeOverlay(); return 1")
d.save_screenshot("_m2_tank.png")
for view in ["shop", "fish", "achiev", "settings"]:
    d.execute_script(f"openView('{view}'); return 1")
    time.sleep(0.3)
    sw = d.execute_script("return [document.documentElement.scrollWidth, innerWidth, document.querySelector('.overlay-sheet').getBoundingClientRect().width]")
    check(f"sem overflow horizontal ({view})", sw[0] <= sw[1], sw)
    d.save_screenshot(f"_m2_{view}.png")
    d.execute_script("closeOverlay(); return 1")
    time.sleep(0.2)

print("\n".join(results))
fails = [r for r in results if r.startswith("FAIL")]
print("\n%d checks, %d falhas" % (len(results), len(fails)))
d.quit()
