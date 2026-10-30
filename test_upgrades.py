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

# ---------- parâmetros com ideal ----------
check("temperatura ideal disponivel sem texto extra",
      "26°C" in d.find_element(By.ID, "paramTempLabel").get_attribute("title"))
check("pH ideal disponivel sem texto extra",
      "8.1" in d.find_element(By.ID, "paramPhLabel").get_attribute("title"))
check("selo de qualidade existe", d.find_element(By.ID, "waterQuality").text in ("IDEAL", "ATENÇÃO", "CRÍTICO"),
      d.find_element(By.ID, "waterQuality").text)
check("temperatura aparece apenas no painel de água",
      d.find_elements(By.ID, "tankWarn") == []
      and d.find_element(By.ID, "paramTemp").is_displayed())

# ---------- painel de luz bloqueado ----------
check("luz começa desligada", d.find_element(By.ID, "lightState").text == "DESLIGADA")
panel_background_off = d.execute_script("return getComputedStyle(document.querySelector('.panel')).backgroundImage")
check("janelas usam o visual azul original", "rgb(16, 37, 60)" in panel_background_off)
light_widget = d.find_element(By.CSS_SELECTOR, '[data-widget="light"]')
light_geometry_before = d.execute_script("return getWidgetGeometry(arguments[0])", light_widget)
d.execute_script("setWidgetGeometry(arguments[0], {...getWidgetGeometry(arguments[0]), width: 780, height: 216})", light_widget)
light_geometry_compact = d.execute_script("return getWidgetGeometry(arguments[0])", light_widget)
check("janela UV limita tamanho máximo",
      light_geometry_compact["width"] <= 420 and light_geometry_compact["height"] <= 144,
      light_geometry_compact)
d.execute_script("setWidgetGeometry(arguments[0], arguments[1])", light_widget, light_geometry_before)
check("6 cores no painel", len(d.find_elements(By.CSS_SELECTOR, "#lightDots .light-dot")) == 6)
check("cores bloqueadas sem UV", len(d.find_elements(By.CSS_SELECTOR, "#lightDots .light-dot.locked")) == 6)

# clique em cor bloqueada leva à loja
d.find_element(By.CSS_SELECTOR, "#lightDots .light-dot").click()
time.sleep(0.4)
check("cor bloqueada abre a loja",
      d.find_element(By.ID, "overlay").get_attribute("class").find("open") >= 0
      and d.find_element(By.ID, "overlayTitle").text == "LOJA",
      d.find_element(By.ID, "overlayTitle").text)

# ---------- comprar equipamentos dentro da loja ----------
d.execute_script("state.coins = 3000; renderAll(); return 1")
time.sleep(0.2)
coins0 = d.execute_script("return state.coins")
d.execute_script("document.querySelector('[data-upg=\\\"heater\\\"]').click(); return 1")
time.sleep(0.4)
check("aquecedor comprado nível 1", d.execute_script("return state.equipment.heater") == 1)
check("aquecedor cobrou o preço", d.execute_script("return state.coins") == coins0 - 35)
check("nível aparece no item", "NÍVEL 1" in d.execute_script("return document.querySelector('[data-upg=\\\"heater\\\"]').closest('.row-item').textContent"))
check("loja continua aberta após comprar", d.find_element(By.ID, "overlayTitle").text == "LOJA")

# aquecedor segura a temperatura
d.execute_script("state.equipment.heater = 0; state.water.temp = 18; for (let i=0;i<120;i++) waterTick(); return 1")
temp_sem = d.execute_script("return state.water.temp")
d.execute_script("state.equipment.heater = 3; state.water.temp = 18; for (let i=0;i<120;i++) waterTick(); return 1")
temp_com = d.execute_script("return state.water.temp")
check("sem aquecedor a água esfria", temp_sem < 22.6, round(temp_sem, 2))
check("aquecedor máximo volta ao ideal", abs(temp_com - 26) < 0.35, round(temp_com, 2))

# condicionador de pH
d.execute_script("state.equipment.buffer = 0; state.water.ph = 6.5; for (let i=0;i<120;i++) waterTick(); return 1")
ph_sem = d.execute_script("return state.water.ph")
d.execute_script("state.equipment.buffer = 3; state.water.ph = 6.5; for (let i=0;i<120;i++) waterTick(); return 1")
ph_com = d.execute_script("return state.water.ph")
check("sem condicionador o pH cai", ph_sem < 7.85, round(ph_sem, 2))
check("condicionador máximo segura o pH", abs(ph_com - 8.1) < 0.1, round(ph_com, 2))

# filtro segura a sujeira
d.execute_script("state.equipment.filter = 0; state.water.clean = 60; waterTick(); return 1")
clean_sem = d.execute_script("return state.water.clean")
d.execute_script("state.equipment.filter = 3; state.water.clean = 60; waterTick(); return 1")
clean_com = d.execute_script("return state.water.clean")
check("filtro reduz a sujeira", (60 - clean_com) < (60 - clean_sem), (round(clean_sem, 2), round(clean_com, 2)))

# água ruim acelera a queda de felicidade
d.execute_script(
    "state.equipment = {heater:0, filter:0, oxygen:0, buffer:0, uv:0};"
    "state.water = {clean: 20, temp: 20, ph: 6.6};"
    "const p = state.pets[0]; p.shown = true; p.happy = 90; waterTick();"
    "return state.pets[0].happy")
happy_bad = d.execute_script("return state.pets[0].happy")
check("água ruim acelera a tristeza", (90 - happy_bad) > 0.35, round(90 - happy_bad, 2))

# ---------- luz UV + cores ----------
d.execute_script("state.coins = 3000; openView('shop'); return 1")
time.sleep(0.3)
d.execute_script("document.querySelector('[data-upg=\\\"uv\\\"]').click(); return 1")
time.sleep(0.5)
check("luz UV comprada", d.execute_script("return state.equipment.uv") == 1)
check("janelas mantêm o visual azul com UV",
      d.execute_script("return getComputedStyle(document.querySelector('.panel')).backgroundImage") == panel_background_off)
time.sleep(0.9)
check("barra UV aparece sem filtro sobre a água",
      d.execute_script("return !!document.querySelector('#uvLamp') && !document.querySelector('#lightLayer')"
                       " && document.getElementById('tank').classList.contains('lit')"
                       " && getComputedStyle(document.getElementById('uvLamp')).opacity === '0.9'"))
check("grade de cores aparece", len(d.find_elements(By.CSS_SELECTOR, ".color-opt")) == 6)
check("azul já vem ativa", "ATIVA" in d.find_element(By.CSS_SELECTOR, ".color-opt[data-color='blue']").text)
background_tank = d.execute_script("return document.getElementById('water').style.background")

coins_ciano = d.execute_script("return state.coins")
d.execute_script("document.querySelector('.color-opt[data-color=\\\"cyan\\\"]').click(); return 1")
time.sleep(0.4)
check("comprou a cor ciano", d.execute_script("return state.lightColors.includes('cyan')"))
check("cor ciano ficou ativa", d.execute_script("return state.lightColor") == "cyan")
check("cor ciano cobrou 60", d.execute_script("return state.coins") == coins_ciano - 60)
check("cor UV não altera o aquário",
      d.execute_script("return document.getElementById('water').style.background") == background_tank
      and not d.execute_script("return document.querySelector('#lightLayer')"))
check("cor UV não altera as janelas",
      d.execute_script("return getComputedStyle(document.querySelector('.panel')).backgroundImage") == panel_background_off)
d.save_screenshot("_upg_luz.png")

# trocar de volta pelo painel lateral
d.execute_script("closeOverlay(); return 1")
time.sleep(0.25)
d.execute_script("document.querySelector('#lightDots [data-color=\\\"blue\\\"]').click(); return 1")
time.sleep(0.3)
check("painel lateral troca a cor", d.execute_script("return state.lightColor") == "blue")
check("janelas preservam o visual azul",
      d.execute_script("return getComputedStyle(document.querySelector('.panel')).backgroundImage") == panel_background_off)
check("painel mostra nível da luz", d.find_element(By.ID, "lightState").text == "NÍVEL 1")
check("painel atualiza o bônus", "Oxigênio" in d.find_element(By.ID, "lightHint").text, d.find_element(By.ID, "lightHint").text)
d.execute_script("state.equipment.uv = 0; renderAll(); return 1")
check("janelas continuam no visual azul original",
      d.execute_script("return getComputedStyle(document.querySelector('.panel')).backgroundImage") == panel_background_off)
check("barra UV desliga junto com a luz",
      not d.execute_script("return document.getElementById('tank').classList.contains('lit')"))
d.execute_script("state.equipment.uv = 1; renderAll(); return 1")

# cor bloqueada no painel manda para a loja
d.execute_script("document.querySelector('#lightDots [data-color=\\\"green\\\"]').click(); return 1")
time.sleep(0.4)
check("cor bloqueada no painel abre a loja", d.find_element(By.ID, "overlayTitle").text == "LOJA")
d.execute_script("closeOverlay(); return 1")
time.sleep(0.2)

# cabeçalho dos parâmetros também abre a loja
d.find_element(By.ID, "paramsHead").click()
time.sleep(0.35)
check("cabeçalho dos parâmetros abre a loja", d.find_element(By.ID, "overlayTitle").text == "LOJA")
d.execute_script("closeOverlay(); return 1")
time.sleep(0.2)

# bônus de cor: violeta dá EXP extra
d.execute_script("state.coins = 3000; state.lightColors.push('violet'); state.lightColor = 'violet'; state.exp = 0; addExp(100); return 1")
check("violeta dá bônus de EXP", d.execute_script("return state.exp") == 108, d.execute_script("return state.exp"))

# bônus de cor: âmbar deixa a moeda flutuante valer mais
check("âmbar aumenta o valor da moeda", d.execute_script("state.lightColor = 'amber'; return 5 + (lightBonus('amber') ? uvLevel() : 0)") == 6)

# ---------- capacidade dentro da loja ----------
d.execute_script("state.coins = 3000; state.lightColor = 'violet'; openView('shop'); return 1")
time.sleep(0.3)
cap0 = d.execute_script("return state.capacity")
d.find_element(By.ID, "shopExpand").click()
time.sleep(0.4)
check("expansão pela loja", d.execute_script("return state.capacity") == cap0 + 2)
check("preço da expansão aumenta", d.execute_script("return expansionCost()") == 250, d.execute_script("return expansionCost()"))
d.save_screenshot("_upg_view.png")

# ---------- conquistas ----------
d.execute_script(
    "state.coins = 3000; state.equipment.oxygen = 0; state.equipment.filter = 0;"
    "state.equipment.buffer = 0; state.equipment.heater = 3;"
    "state.stats.upgrades = 0;"
    "buyUpgrade('oxygen'); buyUpgrade('oxygen'); buyUpgrade('filter');"
    "buyUpgrade('filter'); buyUpgrade('buffer'); return 1")
time.sleep(0.4)
check("5 compras contabilizadas", d.execute_script("return state.stats.upgrades") == 5)
d.execute_script("openView('achiev'); return 1")
time.sleep(0.3)
ach = d.execute_script("return [...document.querySelectorAll('.achiev-item')].map(e => (e.classList.contains('locked') ? 'locked' : 'done') + '|' + e.querySelector('.ri-name').textContent.trim())")
check("conquista Iluminado desbloqueada", "done|Iluminado" in ach, ach)
check("conquista Equipado desbloqueada", "done|Equipado" in ach, ach)
check("conquista Colorido desbloqueada", "done|Colorido" in ach, ach)

# ---------- persistência ----------
d.refresh()
time.sleep(0.6)
st = d.execute_script("return JSON.parse(JSON.stringify(state))")
check("save guarda equipamentos", st["equipment"]["uv"] == 1 and st["equipment"]["heater"] == 3, st["equipment"])
check("save guarda cores", st["lightColor"] == "violet" and "cyan" in st["lightColors"], (st["lightColor"], st["lightColors"]))
check("luz reacende após recarregar", d.execute_script("return document.getElementById('tank').classList.contains('lit')"))

# ---------- mobile ----------
d.set_window_size(1440, 900)
d.get("http://127.0.0.1:8777/_preview.html?w=390&h=844&fit=0")
time.sleep(0.8)
d.switch_to.frame(d.find_element(By.ID, "frame"))
time.sleep(0.3)
d.execute_script("openView('shop'); return 1")
time.sleep(0.4)
sw = d.execute_script("return [document.documentElement.scrollWidth, innerWidth]")
check("loja sem overflow no mobile", sw[0] <= sw[1], sw)
check("grade de cores em 3 colunas no mobile",
      d.execute_script("return getComputedStyle(document.querySelector('.color-grid')).gridTemplateColumns.split(' ').length") == 3)
d.save_screenshot("_upg_mobile.png")

print("\n".join(results))
fails = [r for r in results if r.startswith("FAIL")]
print("\n%d checks, %d falhas" % (len(results), len(fails)))
d.quit()
