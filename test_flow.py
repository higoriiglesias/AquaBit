import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.edge.options import Options

URL = "http://127.0.0.1:8777/aquario.html"
results = []


def check(name, cond, extra=""):
    results.append(("OK  " if cond else "FAIL") + "  " + name + (("  -> " + str(extra)) if extra else ""))


o = Options()
o.add_argument("--headless=new")
o.add_argument("--window-size=1600,900")
d = webdriver.Edge(options=o)
d.set_window_size(1600, 900)
d.get(URL)
d.execute_script("localStorage.clear()")
d.get(URL)
time.sleep(0.4)

st = d.execute_script("return JSON.parse(JSON.stringify(state))")
fish_sprite_results = d.execute_async_script("""
  const done = arguments[arguments.length - 1];
  const urls = [...new Set(Object.values(SPECIES).flat().map(species => species.img))];
  Promise.all(urls.map(url => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve({url, loaded: true});
    image.onerror = () => resolve({url, loaded: false});
    image.src = url;
  }))).then(done);
""")
check("todos os sprites de peixe do catalogo carregam",
      len(fish_sprite_results) == 31 and all(sprite["loaded"] for sprite in fish_sprite_results),
      [sprite["url"] for sprite in fish_sprite_results if not sprite["loaded"]])
check("primeiro acesso inicia sem modal de tipo", d.find_elements(By.ID, "typeModal") == [])
check("tipo do aquario nao aparece mais no topo", d.find_elements(By.ID, "tankPill") == [])
check("grade interativa deixa recursos fixos no topo",
      d.execute_script("return document.getElementById('dashboard').contains(document.getElementById('coins'))") is False)
check("recursos do topo ficam alinhados a direita",
d.execute_script(
          "const actions = document.querySelector('.top-actions').getBoundingClientRect();"
          "return innerWidth - actions.right <= 14"))
check("grade usa toda a largura da tela",
      d.execute_script("return document.querySelector('.app').getBoundingClientRect().width >= innerWidth - 1"))
check("inventario de peixes usa a faixa direita em largura ampla",
      d.execute_script(
          "return getComputedStyle(document.querySelector('[data-widget=fish] .fish-list')).display === 'grid'"))
check("agua salgada e o tipo padrao", st["tankType"] == "salt", st["tankType"])
check("2 peixes iniciais de agua salgada", sorted(p["species"] for p in st["pets"]) == ["anchovy", "clownfish"], [p["species"] for p in st["pets"]])
check("pH agua salgada", abs(st["water"]["ph"] - 8.1) < 0.2, st["water"]["ph"])
check("resumo mostra contagem de peixes bebes",
      d.execute_script("return document.querySelector('#tankSummary .summary-card:last-child .summary-label').textContent") == "Bebês"
      and d.execute_script("return document.querySelector('#tankSummary .summary-card:last-child .summary-value').textContent") == "2")
check("tarefas usam rótulos curtos",
      [e.text for e in d.find_elements(By.CSS_SELECTOR, "#taskList .task-text")] == ["Alimentar", "Carinho", "Limpar"])
check("rodape esconde informacoes repetidas quando nao ha alerta",
      d.find_elements(By.ID, "tankFooter") == []
      and d.find_elements(By.ID, "tankWarn") == [])
resize_handles = d.find_elements(By.CSS_SELECTOR, "[data-widget='tank'] .widget-resize")
check("alcas de redimensionamento so ficam visiveis ao organizar",
      len(resize_handles) == 8
      and all(d.execute_script("return getComputedStyle(arguments[0]).opacity", handle) == "0"
              for handle in resize_handles))
check("alcas nos cantos nao exibem quadrados azuis",
      d.execute_script(
          "return [...document.querySelectorAll('[data-widget=tank] .widget-resize')]"
          ".filter(handle=>['ne','se','sw','nw'].includes(handle.dataset.resizeEdge))"
          ".every(handle=>getComputedStyle(handle).backgroundColor==='rgba(0, 0, 0, 0)')"))
minimum_sizes = {
    "overview": (300, 216), "fish": (360, 204), "water": (288, 252),
    "tank": (336, 360), "tasks": (288, 216), "decor": (288, 216),
    "background": (336, 240), "light": (312, 216)
}
window_sizes = d.execute_script(
    "return [...document.querySelectorAll('#dashboard .dashboard-widget')]"
    ".map(w=>{const g=getWidgetGeometry(w),r=w.getBoundingClientRect();"
    "return [w.dataset.widget,g.width,g.height,r.width,r.height,"
    "w.scrollWidth,w.clientWidth,w.scrollHeight,w.clientHeight,"
    "getComputedStyle(w).display!=='none'];})")
check("todas as janelas respeitam o tamanho minimo e evitam rolagem constante",
      all(width >= minimum_sizes[key][0] and height >= minimum_sizes[key][1]
          and (not visible or (rect_width >= minimum_sizes[key][0] - 1
                               and rect_height >= minimum_sizes[key][1] - 1
                               and scroll_width <= client_width + 1
                               and scroll_height <= client_height + 1))
          for key, width, height, rect_width, rect_height, scroll_width, client_width,
          scroll_height, client_height, visible
          in window_sizes), window_sizes)
check("posicoes e dimensoes seguem a grade minima",
      d.execute_script(
          "return [...document.querySelectorAll('#dashboard .dashboard-widget')].every(w=>{"
          "const g=getWidgetGeometry(w);return ['x','y','width','height'].every(k=>"
          "Math.abs(g[k]/12-Math.round(g[k]/12))<0.001)})"))
check("base e botoes ficam integrados ao aquario",
      d.execute_script(
          "const base=document.querySelector('[data-widget=tank] .tank-base').getBoundingClientRect();"
          "const consoleRect=document.querySelector('[data-widget=tank] .tank-console').getBoundingClientRect();"
          "return Math.abs(consoleRect.top-base.bottom)<=2"))
check("paineis iniciam sem sobreposicao",
      d.execute_script(
          "const items=[...document.querySelectorAll('#dashboard .dashboard-widget')]"
          ".filter(item=>getComputedStyle(item).display!=='none');"
          "return items.every((a,i)=>items.slice(i+1).every(b=>{"
          "const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();"
          "return x.right+9<=y.left||y.right+9<=x.left||x.bottom+9<=y.top||y.bottom+9<=x.top}))"))
left_side_layout = d.execute_script(
          "const root=document.getElementById('dashboard');"
          "const widgets=new Map([...root.querySelectorAll('.dashboard-widget')].map(w=>[w.dataset.widget,w]));"
          "const saved=new Map([...widgets].map(([key,w])=>[key,getWidgetGeometry(w)]));"
          "const moved=widgets.get('tasks'),tankGeometry=getWidgetGeometry(widgets.get('tank'));"
          "setWidgetGeometry(moved,{...getWidgetGeometry(moved),x:0,y:tankGeometry.y});"
          "reflowDashboardWidgets(widgets,root,moved);"
          "const task=moved.getBoundingClientRect(),tank=widgets.get('tank').getBoundingClientRect();"
          "const items=[...widgets.values()].filter(w=>getComputedStyle(w).display!=='none');"
          "const clear=items.every((a,i)=>items.slice(i+1).every(b=>{"
          "const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();"
          "return x.right+9<=y.left||y.right+9<=x.left||x.bottom+9<=y.top||y.bottom+9<=x.top}));"
          "const result={task:[task.left,task.top,task.width,task.height],"
          "tank:[tank.left,tank.top,tank.width,tank.height],clear,"
          "items:items.map(w=>[w.dataset.widget,...Object.values(getWidgetGeometry(w))])};"
          "saved.forEach((g,key)=>setWidgetGeometry(widgets.get(key),g));"
          "return result")
check("painel pode ocupar a esquerda do aquario deslocando as outras janelas",
      left_side_layout["task"][0] < left_side_layout["tank"][0]
      and left_side_layout["task"][0] + left_side_layout["task"][2] + 9 <= left_side_layout["tank"][0]
      and left_side_layout["clear"], left_side_layout)
check("janela do aquario nao tem rolagem horizontal",
      d.execute_script(
          "const tank=document.querySelector('[data-widget=tank]');"
          "return tank.scrollWidth<=tank.clientWidth+1"))
check("menu superior nao cobre o aquario com sombra",
      d.execute_script(
          "const toolbar=document.querySelector('.dashboard-toolbar'),style=getComputedStyle(toolbar);"
          "return style.backgroundColor==='rgba(0, 0, 0, 0)'&&style.boxShadow==='none'"))
d.find_element(By.ID, "layoutToggle").click()
check("modo de organizacao ativa os controles",
      "editing" in d.find_element(By.ID, "dashboard").get_attribute("class")
      and d.find_element(By.ID, "layoutReset").is_displayed())
check("barras de rolagem ficam invisiveis e borda pontilhada permanece",
      d.execute_script(
          "const panel=document.querySelector('[data-widget=tasks]');"
          "return getComputedStyle(panel).scrollbarWidth==='none'"
          "&&getComputedStyle(panel,'::-webkit-scrollbar').display==='none'"
          "&&getComputedStyle(panel).overflowY==='auto'"
          "&&getComputedStyle(panel).outlineStyle==='dashed'"))
check("botao de organizacao fica no menu superior",
      d.execute_script(
          "return document.querySelector('.topbar').contains(document.getElementById('layoutToggle'))"))
order_before_drag = d.execute_script("return dashboardWidgetOrder()")
drag_grip = d.find_element(By.CSS_SELECTOR, "[data-widget='overview'] .widget-grip")
fish_widget = d.find_element(By.CSS_SELECTOR, "[data-widget='fish']")
overview_before = d.execute_script(
    "return document.querySelector('[data-widget=overview]').getBoundingClientRect().left")
overview_top_before = d.execute_script(
    "return document.querySelector('[data-widget=overview]').getBoundingClientRect().top")
drag_positions = d.execute_script(
    "const grip=document.querySelector('[data-widget=overview] .widget-grip');"
    "const start=grip.getBoundingClientRect();"
    "const x=start.left+start.width/2,y=start.top+start.height/2;"
    "grip.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:41,button:0,clientX:x,clientY:y}));"
    "document.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:41,"
    "clientX:x,clientY:y+3000}));"
    "const moved=document.querySelector('[data-widget=overview]').getBoundingClientRect();"
    "return [moved.left,moved.top,"
    "document.querySelector('[data-widget=overview]').classList.contains('is-dragging')]")
check("janela acompanha o arraste",
      drag_positions[2]
      and (drag_positions[0] != overview_before or drag_positions[1] != overview_top_before),
      [overview_before, overview_top_before, drag_positions])
d.execute_script("document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:41,button:0}))")
check("paineis nao se sobrepoem apos soltar",
      d.execute_script(
          "const items=[...document.querySelectorAll('#dashboard .dashboard-widget')]"
          ".filter(item=>getComputedStyle(item).display!=='none');"
          "return items.every((a,i)=>items.slice(i+1).every(b=>{"
          "const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();"
          "return x.right+9<=y.left||y.right+9<=x.left||x.bottom+9<=y.top||y.bottom+9<=x.top}))"))
order_after_drag = d.execute_script("return dashboardWidgetOrder()")
check("arrastar reorganiza os paineis", order_after_drag != order_before_drag, order_after_drag[:3])
check("ordem arrastada foi salva",
      d.execute_script("return JSON.parse(localStorage.getItem('aquabitzee_dashboard_layout_v1'))") == order_after_drag)
d.find_element(By.ID, "layoutReset").click()
d.execute_script(
    "document.querySelector('[data-widget=overview] .widget-grip').dispatchEvent("
    "new KeyboardEvent('keydown', {key:'ArrowRight', bubbles:true})); return 1")
custom_order = d.execute_script("return JSON.parse(localStorage.getItem('aquabitzee_dashboard_layout_v1'))")
check("painel pode ser reorganizado pelo teclado e salva a ordem",
      custom_order[:2] == ["fish", "overview"], custom_order[:2])
d.refresh()
time.sleep(0.5)
check("ordem da grade persiste ao recarregar",
      d.execute_script("return document.querySelector('#dashboard .dashboard-widget').dataset.widget") == "fish")
d.find_element(By.ID, "layoutToggle").click()
d.find_element(By.ID, "layoutReset").click()
check("restaurar volta a grade original",
      d.execute_script("return document.querySelector('#dashboard .dashboard-widget').dataset.widget") == "overview"
      and d.execute_script("return localStorage.getItem('aquabitzee_dashboard_layout_v1')") is None)
tank_widget = d.find_element(By.CSS_SELECTOR, "[data-widget='tank']")
tank_before_resize = d.execute_script(
    "const tank = document.querySelector('[data-widget=tank]');"
    "return [tank.getBoundingClientRect().left, tank.getBoundingClientRect().top,"
    "tank.getBoundingClientRect().width, tank.getBoundingClientRect().height]")
d.execute_script(
    "const h=document.querySelector('[data-widget=tank] [data-resize-edge=w]');"
    "const r=h.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;"
    "h.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:43,button:0,clientX:x,clientY:y}));"
    "document.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:43,clientX:x+37,clientY:y}));"
    "document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:43,button:0}));")
resized_tank = d.execute_script(
    "const r=document.querySelector('[data-widget=tank]').getBoundingClientRect();return [r.left,r.top,r.width,r.height]")
check("base do aquario redimensiona sem invadir outra janela",
      resized_tank[2] < tank_before_resize[2]
      and d.execute_script(
          "const a=document.querySelector('[data-widget=tank]').getBoundingClientRect();"
          "return [...document.querySelectorAll('#dashboard .dashboard-widget')]"
          ".filter(item=>item.dataset.widget!=='tank'&&getComputedStyle(item).display!=='none')"
          ".every(item=>{const b=item.getBoundingClientRect();"
          "return a.right+9<=b.left||b.right+9<=a.left||a.bottom+9<=b.top||b.bottom+9<=a.top})"),
      resized_tank)
check("base e botoes continuam integrados depois de redimensionar",
      d.execute_script(
          "const base=document.querySelector('[data-widget=tank] .tank-base').getBoundingClientRect();"
          "const consoleRect=document.querySelector('[data-widget=tank] .tank-console').getBoundingClientRect();"
          "return Math.abs(consoleRect.top-base.bottom)<=2"))
d.find_element(By.CSS_SELECTOR, "[data-widget='tank'] [data-resize-edge='w']")
d.execute_script(
    "const h=document.querySelector('[data-widget=tank] [data-resize-edge=w]');"
    "const r=h.getBoundingClientRect();h.dispatchEvent(new PointerEvent('pointerdown',"
    "{bubbles:true,pointerId:42,button:0,clientX:r.left+r.width/2,clientY:r.top+r.height/2}));"
    "document.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:42,clientX:r.left+17,"
    "clientY:r.top+r.height/2}));document.dispatchEvent(new PointerEvent('pointerup',"
    "{bubbles:true,pointerId:42,button:0}));")
left_resized_tank = d.execute_script(
    "const r=document.querySelector('[data-widget=tank]').getBoundingClientRect();"
    "return [r.left,r.top,r.width,r.height]")
check("borda esquerda move e redimensiona livremente",
      left_resized_tank[0] > resized_tank[0] and left_resized_tank[2] < resized_tank[2], left_resized_tank)
saved_tank = d.execute_script(
    "return JSON.parse(localStorage.getItem('aquabitzee_dashboard_sizes_v1') || '{}').tank")
check("posicao e tamanho sao salvos em pixels",
      saved_tank is not None and saved_tank["x"] >= 0 and saved_tank["width"] > 300)
d.refresh()
time.sleep(0.5)
check("tamanho livre do aquario persiste ao recarregar",
      all(abs(actual - expected) < 0.5 for actual, expected in zip(d.execute_script(
          "const r=document.querySelector('[data-widget=tank]').getBoundingClientRect();"
          "return [r.left,r.top,r.width,r.height]"), left_resized_tank)))

d.find_element(By.ID, "layoutToggle").click()
fish_widget = d.find_element(By.CSS_SELECTOR, "[data-widget='fish']")
fish_widget.find_element(By.CSS_SELECTOR, "[data-window-action='minimize']").click()
check("painel minimizado aparece na barra",
      "is-window-minimized" in fish_widget.get_attribute("class")
      and not d.find_element(By.ID, "dashboardMinimized").get_attribute("hidden"))
d.find_element(By.CSS_SELECTOR, ".minimized-window").click()
check("painel minimizado pode ser restaurado",
      "is-window-minimized" not in fish_widget.get_attribute("class"))
fish_widget.find_element(By.CSS_SELECTOR, "[data-window-action='close']").click()
check("painel fechado aparece no menu de janelas",
      "is-window-closed" in fish_widget.get_attribute("class")
      and not d.find_element(By.ID, "windowManagerToggle").get_attribute("hidden"))
d.refresh()
time.sleep(0.5)
check("painel fechado permanece fechado ao recarregar",
      "is-window-closed" in d.find_element(By.CSS_SELECTOR, "[data-widget='fish']").get_attribute("class"))
d.find_element(By.ID, "layoutToggle").click()
d.find_element(By.ID, "windowManagerToggle").click()
d.find_element(By.CSS_SELECTOR, ".reopen-window").click()
check("painel fechado pode ser reaberto pelo menu",
      "is-window-closed" not in d.find_element(By.CSS_SELECTOR, "[data-widget='fish']").get_attribute("class"))
d.find_element(By.ID, "layoutReset").click()
check("restaurar limpa o tamanho e o estado das janelas",
      d.execute_script(
          "return localStorage.getItem('aquabitzee_dashboard_sizes_v1') === null"
          " && localStorage.getItem('aquabitzee_dashboard_windows_v1') === null"))

# feed
coins_before = d.execute_script("return state.coins")
hunger_before = d.execute_script("return state.pets[0].hunger")
food_before = d.execute_script("return state.food")
d.find_element(By.ID, "actFeed").click()
time.sleep(0.2)
check("alimentar gasta comida", d.execute_script("return state.food") == food_before - 1, d.execute_script("return state.food"))
check("alimentar aumenta fome", d.execute_script("return state.pets[0].hunger") > hunger_before)
check("tarefa alimentar concluida", d.execute_script("return state.tasks.feed") is True)
check("moedas +10 pela tarefa", d.execute_script("return state.coins") == coins_before + 10, d.execute_script("return state.coins"))

# pet
love_before = d.execute_script("return state.pets[0].love")
coins_before_pet = d.execute_script("return state.coins")
d.find_element(By.ID, "actPet").click()
time.sleep(0.2)
check("carinho aumenta amor", d.execute_script("return state.pets[0].love") > love_before)
check("tarefa carinho concluida", d.execute_script("return state.tasks.pet") is True)
check("moedas +10 pelo carinho", d.execute_script("return state.coins") == coins_before_pet + 10)

# clean
d.execute_script("state.water.clean = 20; renderAll(); return 1")
coins_before_clean = d.execute_script("return state.coins")
cleans_before = d.execute_script("return state.stats.cleans")
d.find_element(By.ID, "actClean").click()
time.sleep(0.2)
d.find_element(By.ID, "actClean").click()
time.sleep(0.2)
check("limpeza parcial exige nova acao",
      d.execute_script("return state.water.clean > 50 && state.water.clean < 100"))
check("limpeza parcial nao conclui a tarefa",
      d.execute_script("return !state.tasks.clean && state.stats.cleans == arguments[0]", cleans_before))
d.find_element(By.ID, "actClean").click()
time.sleep(0.2)
check("limpar restaura a agua", d.execute_script("return state.water.clean") == 100)
check("bonus ao completar as 3 tarefas", d.execute_script("return state.coins") == coins_before_clean + 25)
check("limpeza concluida contabilizada", d.execute_script("return state.stats.cleans") == cleans_before + 1)
time.sleep(1.2)
check("tarefas continuam concluidas no mesmo dia",
      d.execute_script("return state.tasks.feed && state.tasks.pet && state.tasks.clean"))
d.execute_script("state.tasksDate = '2000-01-01'; return ensureDailyTasks()")
check("tarefas reiniciam no dia seguinte",
      d.execute_script("return !state.tasks.feed && !state.tasks.pet && !state.tasks.clean"))
d.execute_script("state.tasks.feed = true; state.tasks.pet = true; state.tasks.clean = true; save(); return 1")

# shop via tank action
d.execute_script("state.coins = 400; renderAll(); return 1")
cap_before = d.execute_script("return state.capacity")
d.find_element(By.ID, "actShop").click()
time.sleep(0.3)
check("botao LOJA abre a loja", d.find_element(By.ID, "overlay").get_attribute("class").find("open") >= 0)
d.find_element(By.ID, "shopExpand").click()
time.sleep(0.3)
d.execute_script("closeOverlay(); return 1")
check("expandir aumenta capacidade", d.execute_script("return state.capacity") == cap_before + 2, d.execute_script("return state.capacity"))
check("capacidade aparece na lista", d.find_element(By.ID, "fishMax").text == str(cap_before + 2), d.find_element(By.ID, "fishMax").text)

# fish panel header opens the full fish list
d.find_element(By.ID, "fishHead").click()
time.sleep(0.3)
check("cabecalho PEIXES abre lista completa",
      d.find_element(By.ID, "overlay").get_attribute("class").find("open") >= 0)
shown_before = d.execute_script("return state.pets.filter(p => p.shown).length")
target_uid = d.execute_script("return Number(document.querySelector('#overlayBody .card').dataset.uid)")
d.find_element(By.CSS_SELECTOR, f"#overlayBody [data-fish-toggle='{target_uid}']").click()
time.sleep(0.2)
check("remover peixe direto pelo inventario",
      d.execute_script("return state.pets.filter(p => p.shown).length") == shown_before - 1)
d.find_element(By.CSS_SELECTOR, f"#overlayBody [data-fish-toggle='{target_uid}']").click()
time.sleep(0.2)
check("recolocar peixe direto pelo inventario",
      d.execute_script("return state.pets.filter(p => p.shown).length") == shown_before)
d.execute_script("closeOverlay(); return 1")

# backgrounds are real images
d.execute_script("state.coins = 400; renderAll(); return 1")
thumbs = d.execute_script("return [...document.querySelectorAll('#bgList .bg-preview')].map(e => getComputedStyle(e).backgroundImage)")
check("3 miniaturas de fundo com imagem", len(thumbs) == 3 and all("bg_" in t for t in thumbs), thumbs)
d.find_elements(By.CSS_SELECTOR, "#bgList .bg-opt")[2].click()
time.sleep(0.3)
water_bg = d.execute_script("return getComputedStyle(document.getElementById('water')).backgroundImage")
check("fundo RIO aplicado no tanque", "bg_rio" in water_bg, water_bg)
check("fundo trocado no save", d.execute_script("return state.background") == "river")

# clique no peixe do tanque = bater no vidro (não abre mais o modal)
tap_uid = d.execute_script("return Number(document.querySelector('.fish').dataset.uid)")
d.execute_script(
    "const p=state.pets.find(p => p.uid === %d);p.happy=80;p.stage='adult';return 1" % tap_uid)
happy_before = d.execute_script("return state.pets.find(p => p.uid === %d).happy" % tap_uid)
d.execute_script("document.querySelector('.fish').click(); return 1")
time.sleep(0.35)
check("clicar no peixe nao abre o modal",
      d.find_element(By.ID, "fishModal").get_attribute("class").find("open") == -1)
check("vidro ondula ao clicar", d.execute_script("return document.querySelectorAll('.tap-ripple').length") >= 1)
check("peixe fica triste com a batida",
      d.execute_script("return state.pets.find(p => p.uid === %d).happy" % tap_uid) < happy_before)

# a lista lateral de peixes continua abrindo as informações
d.execute_script("document.querySelector('#fishList .fish-item').click(); return 1")
time.sleep(0.3)
check("lista lateral abre o modal do peixe", d.find_element(By.ID, "fishModal").get_attribute("class").find("open") >= 0)
check("modal mostra nome do peixe", len(d.find_element(By.ID, "fmName").text) > 2, d.find_element(By.ID, "fmName").text)
check("ficha inclui campo para dar nome ao peixe",
      d.find_element(By.ID, "fmNameInput").is_displayed()
      and d.find_element(By.ID, "fmNameSave").is_displayed())
original_name = d.execute_script("return currentFish.name")
d.find_element(By.ID, "fmNameInput").clear()
d.find_element(By.ID, "fmNameInput").send_keys("Nemo")
d.find_element(By.ID, "fmNameSave").click()
check("nome personalizado persiste no save",
      d.execute_script("return currentFish.name") == "Nemo"
      and d.execute_script(
          "return JSON.parse(localStorage.getItem('aquabitzee_dashboard_v1')).pets"
          ".find(p=>p.uid===currentFish.uid).name") == "Nemo")
d.find_element(By.ID, "fmNameInput").clear()
d.find_element(By.ID, "fmNameInput").send_keys(original_name)
d.find_element(By.ID, "fmNameSave").click()
personality_checks = d.execute_script("""
  const clown = personalityOf('clownfish');
  const shark = personalityOf('shark');
  const clam = personalityOf('clam');
  const crab = cursorTargetForFish(
    {x: 40, y: 12, affinity: 20},
    {...personalityOf('crab'), bottom: true},
    {x: 42, y: 12, time: Date.now()}
  );
  const friend = cursorTargetForFish(
    {x: 40, y: 40, affinity: 80},
    {...clown, bottom: false},
    {x: 42, y: 40, time: Date.now()}
  );
  return {
    schooling: clown.schooling,
    playful: clown.playful,
    appetite: shark.appetite > clam.appetite,
    crabFloor: crab.fleeing && crab.y >= 9 && crab.y <= 14,
    followsCursor: friend.following
  };
""")
emote_assets_available = d.execute_async_script("""
  const done = arguments[arguments.length - 1];
  Promise.all(Object.values(FISH_EMOTES).map(({sprite}) =>
    fetch(sprite).then(response => response.ok)
  )).then(results => done(results.every(Boolean)));
""")
check("todos os baloes usam sprites existentes", emote_assets_available)
check("personalidades definem cardume, brincadeira e apetite",
      personality_checks["schooling"] and personality_checks["playful"]
      and personality_checks["appetite"], personality_checks)
check("caranguejo foge apenas no fundo e peixe apegado segue cursor",
      personality_checks["crabFloor"] and personality_checks["followsCursor"], personality_checks)
d.find_element(By.ID, "fmClose").click()
time.sleep(0.2)
check("fechar modal do peixe", d.find_element(By.ID, "fishModal").get_attribute("class").find("open") == -1)

# egg
pets_before = len(d.execute_script("return state.pets"))
d.execute_script("buyEgg('common', 50); return 1")
time.sleep(2.6)
check("ovo choca um peixe novo", len(d.execute_script("return state.pets")) == pets_before + 1, len(d.execute_script("return state.pets")))
newspecies = d.execute_script("return state.pets[state.pets.length-1].species")
check("peixe novo e de agua salgada",
      newspecies in ["anchovy", "clownfish", "clownfishRed", "clownfishGold", "clownfishWhite",
                     "clownfishYellow", "surgeonfish", "silverFish", "reefFish", "moonFish",
                     "pinkFish", "clam", "shrimp"],
      newspecies)
d.find_element(By.ID, "hatchOk").click()
time.sleep(0.2)

# persistence
d.refresh()
time.sleep(0.5)
st2 = d.execute_script("return JSON.parse(JSON.stringify(state))")
check("save persiste apos recarregar", st2["tankType"] == "salt" and len(st2["pets"]) == pets_before + 1)
check("decoracoes iniciais persistem", len(st2["decor"]) >= 5, len(st2["decor"]))

# achievements through settings
d.execute_script("openView('settings'); return 1")
time.sleep(0.3)
check("configuracoes oferece conquistas", d.find_element(By.ID, "openAchiev").is_displayed())
d.find_element(By.ID, "openAchiev").click()
time.sleep(0.3)
check("conquistas abrem pelas configuracoes",
      d.find_element(By.ID, "overlayTitle").text == "CONQUISTAS")
d.find_element(By.ID, "achievBack").click()
time.sleep(0.25)
check("voltar das conquistas para configuracoes",
      d.find_element(By.ID, "overlayTitle").text == "CONFIGURAÇÕES")

# reset
d.execute_script("openView('settings'); return 1")
time.sleep(0.3)
d.find_element(By.ID, "resetGame").click()
time.sleep(0.4)
try:
    d.switch_to.alert.accept()
except Exception as e:
    check("confirm de reset", False, e)
time.sleep(0.8)
check("reset inicia automaticamente em agua salgada",
      d.execute_script("return state.tankType === 'salt' && state.pets.length === 2"))
check("novo save criado apos reset", d.execute_script("return JSON.parse(localStorage.getItem('aquabitzee_dashboard_v1')).tankType") == "salt")

print("\n".join(results))
fails = [r for r in results if r.startswith("FAIL")]
print("\n%d checks, %d falhas" % (len(results), len(fails)))
d.quit()
