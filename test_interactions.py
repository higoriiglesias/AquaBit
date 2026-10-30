import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait

URL = "http://127.0.0.1:8777/aquario.html"


def wait_for(driver, condition, timeout=5):
    return WebDriverWait(driver, timeout).until(condition)


options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1440,900")
driver = webdriver.Edge(options=options)

try:
    driver.set_window_size(1440, 900)
    driver.get(URL)
    driver.execute_script("localStorage.clear()")
    driver.refresh()
    wait_for(driver, lambda d: len(d.find_elements(By.CSS_SELECTOR, ".fish[data-uid]")) >= 2)

    fish = driver.find_element(By.CSS_SELECTOR, ".fish[data-uid]")
    fish.click()
    actions = driver.find_elements(By.CSS_SELECTOR, ".fish-interaction-action")
    assert [button.get_attribute("data-action") for button in actions] == [
        "dice", "trick", "cuddle", "play"
    ]
    assert not driver.find_element(
        By.CSS_SELECTOR, ".fish-interaction-action[data-action='play']"
    ).get_attribute("disabled")

    pet_uid = int(fish.get_attribute("data-uid"))
    before_roll = driver.execute_script(
        "const p=state.pets.find(item=>item.uid===arguments[0]);"
        "return {affinity:p.affinity,happy:p.happy};", pet_uid
    )
    driver.execute_script("window.__oldRandom=Math.random; Math.random=()=>0.5")
    driver.find_element(By.CSS_SELECTOR, "[data-action='dice']").click()
    driver.execute_script("Math.random=window.__oldRandom")
    die = wait_for(driver, lambda d: d.find_element(By.CSS_SELECTOR, ".fish-dice-emote"))
    wait_for(driver, lambda d: die.get_attribute("aria-label") == "Resultado do dado: 4")
    assert die.value_of_css_property("background-position-x") == "-144px"
    after_roll = driver.execute_script(
        "const p=state.pets.find(item=>item.uid===arguments[0]);"
        "return {affinity:p.affinity,happy:p.happy};", pet_uid
    )
    assert after_roll["affinity"] > before_roll["affinity"]
    assert after_roll["happy"] > before_roll["happy"]

    fish = driver.find_element(By.CSS_SELECTOR, f".fish[data-uid='{pet_uid}']")
    fish.click()
    driver.find_element(By.CSS_SELECTOR, "[data-action='trick']").click()
    assert "fishTrick" in driver.find_element(
        By.CSS_SELECTOR, f".fish[data-uid='{pet_uid}'] img"
    ).get_attribute("style")

    before_cuddle = driver.execute_script(
        "return state.pets.find(item=>item.uid===arguments[0]).love;", pet_uid
    )
    fish = driver.find_element(By.CSS_SELECTOR, f".fish[data-uid='{pet_uid}']")
    fish.click()
    driver.find_element(By.CSS_SELECTOR, "[data-action='cuddle']").click()
    assert driver.execute_script(
        "return state.pets.find(item=>item.uid===arguments[0]).love;", pet_uid
    ) > before_cuddle

    fish = driver.find_element(By.CSS_SELECTOR, f".fish[data-uid='{pet_uid}']")
    fish.click()
    driver.find_element(By.CSS_SELECTOR, "[data-action='play']").click()
    friendship = driver.execute_script(
        "const a=state.pets.find(item=>item.uid===arguments[0]);"
        "const b=state.pets.find(item=>item.uid!==arguments[0]&&item.shown);"
        "return {first:a.friendships[b.uid],second:b.friendships[a.uid]};", pet_uid
    )
    assert friendship == {"first": 8, "second": 8}

    driver.execute_script("openFish(arguments[0])", pet_uid)
    assert driver.find_element(By.ID, "fmBondTxt").text
    assert driver.find_element(By.ID, "fmFriend").text.endswith("8%")
    driver.find_element(By.ID, "fmClose").click()

    driver.execute_script(
        "const p=state.pets.find(item=>item.uid===arguments[0]);"
        "const before=state.coins; placeFoundShell(p);"
        "return before;", pet_uid
    )
    coins_before_shell = driver.execute_script("return state.coins")
    driver.find_element(By.CSS_SELECTOR, ".fish-found-shell").click()
    assert driver.execute_script("return state.coins") == coins_before_shell + 3
    driver.execute_script("spawnFishVisitor()")
    assert driver.find_elements(By.CSS_SELECTOR, ".fish-visitor")

    before_passive_coin = driver.execute_script("return state.coins")
    driver.execute_script("""
      document.querySelectorAll('.coin-float').forEach(coin => coin.remove());
      const pet = state.pets.find(item => item.uid === arguments[0]);
      const coin = spawnFloatingCoin(7);
      window.__passiveTestCoin = coin;
      coin.dataset.targetUid = pet.uid;
      coin.classList.add('coin-targeted');
      coin.style.left = (pet.x + 10) + '%';
      coin.style.bottom = pet.y + '%';
      pet._nextMove = 0;
    """, pet_uid)
    assert wait_for(driver, lambda d: d.execute_script(
        "return state.coins >= arguments[0] + 7 && !window.__passiveTestCoin.isConnected",
        before_passive_coin
    ), timeout=7)

    driver.set_window_size(390, 844)
    time.sleep(0.3)
    fish = driver.find_element(By.CSS_SELECTOR, f".fish[data-uid='{pet_uid}']")
    fish.click()
    menu = driver.find_element(By.CSS_SELECTOR, ".fish-interaction-menu")
    bounds = driver.execute_script(
        "const menu=arguments[0].getBoundingClientRect();"
        "const tank=document.getElementById('water').getBoundingClientRect();"
        "return {inside:menu.left>=tank.left&&menu.right<=tank.right"
        "&&menu.top>=tank.top&&menu.bottom<=tank.bottom,"
        "viewport:menu.right<=innerWidth};", menu
    )
    assert bounds["inside"] and bounds["viewport"]

    driver.refresh()
    wait_for(driver, lambda d: len(d.find_elements(By.CSS_SELECTOR, ".fish[data-uid]")) >= 2)
    persisted = driver.execute_script(
        "return state.pets.every(p=>p.friendships&&typeof p.friendships==='object'"
        "&&Object.values(p.friendships).some(value=>value===8));"
    )
    assert persisted

    driver.execute_script(
        "const save=JSON.parse(localStorage.getItem('aquabitzee_dashboard_v1'));"
        "save.pets.forEach(p=>delete p.friendships);"
        "localStorage.setItem('aquabitzee_dashboard_v1',JSON.stringify(save));"
        "location.reload()"
    )
    wait_for(driver, lambda d: len(d.find_elements(By.CSS_SELECTOR, ".fish[data-uid]")) >= 2)
    assert driver.execute_script(
        "return state.pets.every(p=>p.friendships&&typeof p.friendships==='object')"
    )
    print("All fish interaction checks passed.")
finally:
    driver.quit()
