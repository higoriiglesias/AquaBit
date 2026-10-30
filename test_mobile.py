import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options

BASE = "http://127.0.0.1:8777/"
URL = BASE + "aquario.html"
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

# minigame has its own tank action button now
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
    d.execute_script("arguments[0].click(); return 1", b)
time.sleep(0.3)
score = d.execute_script("return gameScore")
check("estourar bolha soma pontos", score >= 5, score)

d.execute_script("gameTimeLeft = 1; return 1")
time.sleep(1.6)
check("fim de jogo devolve moedas", d.execute_script("return state.coins") == coins0 + score,
      (d.execute_script("return state.coins"), coins0, score))
check("contador de jogos", d.execute_script("return state.stats.games") == 1)
check("botao vira jogar novamente",
      "NOVAMENTE" in d.find_element(By.ID, "gameStart").text, d.find_element(By.ID, "gameStart").text)
d.save_screenshot("_game_end.png")

d.execute_script("openView('achiev'); return 1")
time.sleep(0.4)
d.save_screenshot("_achiev_after.png")
ach = d.execute_script("return [...document.querySelectorAll('.achiev-item')].map(e => (e.classList.contains('locked') ? 'locked' : 'done') + '|' + e.textContent.replace(/\\s+/g,' ').trim().slice(0,24))")
check("conquista Jogador desbloqueada", any("Jogador" in a and a.startswith("done") for a in ach), ach)

# ---- mobile via fixed-width iframe ----
d.get(BASE + "_preview.html?w=390&h=844&fit=0")
time.sleep(0.6)
d.execute_script(
    "localStorage.clear(); localStorage.setItem('aquabitzee_dashboard_layout_v1',"
    "JSON.stringify(['light','background','tasks','tank','water','fish','overview','decor']));"
    "localStorage.setItem('aquabitzee_dashboard_windows_v1',"
    "JSON.stringify({closed:['fish'],minimized:['water']})); return 1")
d.refresh()
time.sleep(1.0)
d.switch_to.frame(d.find_element(By.ID, "frame"))

info = d.execute_script("return [innerWidth, document.documentElement.scrollWidth]")
check("viewport mobile = 390", info[0] == 390, info)
check("tank mobile sem overflow horizontal", info[1] <= info[0], info)
mobile_layout = d.execute_script("""
  const dashboard = document.getElementById('dashboard');
  const visibleWidgets = [...dashboard.querySelectorAll('.dashboard-widget')]
    .filter(widget => getComputedStyle(widget).display !== 'none')
    .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
    .map(widget => widget.dataset.widget);
  return {
    toolbar: getComputedStyle(document.querySelector('.dashboard-toolbar')).display,
    grip: getComputedStyle(document.querySelector('.widget-grip')).display,
    widgets: visibleWidgets
  };
""")
check("celular mantem a ordem original mesmo com grade salva",
      mobile_layout["widgets"][:7] == ["tank", "overview", "fish", "water", "tasks", "background", "light"],
      mobile_layout["widgets"])
check("celular ignora janelas fechadas ou minimizadas no desktop",
      d.execute_script(
          "return ['fish','water'].every(key => getComputedStyle("
          "document.querySelector(`[data-widget=${key}]`)).display !== 'none')"))
check("celular nao mostra controles de organizacao",
      mobile_layout["toolbar"] == "none" and mobile_layout["grip"] == "none", mobile_layout)
d.save_screenshot("_m3_tank.png")

# tank action bar now has 5 buttons, including the minigame
acts = d.execute_script("return [...document.querySelectorAll('.tank-btn small')].map(e => e.textContent)")
check("barra de acoes tem JOGAR", "JOGAR" in acts, acts)
d.find_element(By.ID, "actGame").click()
time.sleep(0.4)
check("botao JOGAR abre o seletor de minijogo",
      "open" in d.find_element(By.ID, "pickGameModal").get_attribute("class"))
d.find_element(By.ID, "pickBubbles").click()
time.sleep(0.4)
check("seletor abre o minijogo",
      "open" in d.find_element(By.ID, "gameModal").get_attribute("class"))
d.execute_script("stopGame(); closeModal('gameModal'); return 1")
time.sleep(0.25)

for view in ["fish", "shop", "achiev", "settings"]:
    d.execute_script(f"openView('{view}'); return 1")
    time.sleep(0.35)
    sw = d.execute_script("return [document.documentElement.scrollWidth, innerWidth, Math.round(document.querySelector('.overlay-sheet').getBoundingClientRect().width)]")
    check(f"overlay {view} sem overflow horizontal", sw[0] <= sw[1], sw)
    d.save_screenshot(f"_m3_{view}.png")
    d.execute_script("closeOverlay(); return 1")
    time.sleep(0.25)

d.execute_script("openFish(state.pets[0].uid); return 1")
time.sleep(0.4)
d.save_screenshot("_m3_modal_fish.png")
check("modal do peixe cabe na tela",
      d.execute_script("return Math.round(document.querySelector('#fishModal .modal-card').getBoundingClientRect().width)") <= 390)

d.execute_script("closeModal('fishModal'); openModal('gameModal'); return 1")
time.sleep(0.4)
d.save_screenshot("_m3_game.png")

# achievements now live inside settings
d.execute_script("closeModal('gameModal'); openView('settings'); return 1")
time.sleep(0.35)
check("configuracoes oferece conquistas", d.find_element(By.ID, "openAchiev").is_displayed())
d.find_element(By.ID, "openAchiev").click()
time.sleep(0.35)
check("conquistas abrem pelas configuracoes",
      d.execute_script("return document.getElementById('overlayTitle').textContent") == "CONQUISTAS")
d.find_element(By.ID, "achievBack").click()
time.sleep(0.3)
check("voltar das conquistas para configuracoes",
      d.execute_script("return document.getElementById('overlayTitle').textContent") == "CONFIGURAÇÕES")

print("\n".join(results))
fails = [r for r in results if r.startswith("FAIL")]
print("\n%d checks, %d falhas" % (len(results), len(fails)))
d.quit()
