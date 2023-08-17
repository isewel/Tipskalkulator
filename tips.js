function leggTilAnsatt(navn = '') {
    //Henter hovedcontaineren for alle ansatte
    const ansatteDiv = document.getElementById("ansatte");
    //Oppretter en ny div for en enkelt ansatt
    const ansattDiv = document.createElement("div");
    ansattDiv.className = "ansatt";
    
    ansattDiv.innerHTML = `
      <div class="input-field">
        <input type="text" id="ansatt" name="ansatt" value="${navn}" placeholder=" ">
        <label for="ansatt">Navn</label>
      </div>
      <div class="input-field">
        <input type="number" id="timer" name="timer" placeholder=" ">
        <label for="timer">Antall timer</label>
      </div>
      <span class="resultat-ansatt"></span>
      <button class="fjern-ansatt" onclick="fjernAnsatt(this)">Fjern ansatt</button>
    `;
    ansatteDiv.appendChild(ansattDiv);
  
    const ansattInput = ansattDiv.querySelector("input[name='ansatt']");
    ansattInput.addEventListener('input', lagreAnsatte);
  
    oppdaterFjernAnsattKnapper();
    lagreAnsatte();
  }
  
  function fjernAnsatt(button) {
    const ansattDiv = button.parentElement;
    ansattDiv.remove();
    oppdaterFjernAnsattKnapper();
    fordelTips(); // Oppdater resultatet etter fjerning
    lagreAnsatte();
  }
  
  /**
   * Sikrer at det alltid er minst en ansatt op nettsiden.
   * Deaktiverer "Fjern ansatt"-knappen hvis det kun er en ansatt igjen.
   */
  function oppdaterFjernAnsattKnapper() {
    const fjernAnsattKnapper = document.querySelectorAll('.fjern-ansatt');
    fjernAnsattKnapper.forEach((knapp, index, array) => {
      knapp.disabled = array.length === 1;
    });
  }
  
  /**
   * Lagrer navnene i nettleserens localStorage
   */
  function lagreAnsatte() {
    const ansatteInputs = document.querySelectorAll("input[name='ansatt']");
    const ansatte = Array.from(ansatteInputs).map(input => input.value);
    localStorage.setItem('ansatte', JSON.stringify(ansatte));
  }
  
  /**
   * Fordeler tips blant de ansatte basert på antall timer de har jobbet
   */
  function fordelTips() {
    const totalTips = parseFloat(document.getElementById("totalTips").value);
    const ansatteDivs = document.querySelectorAll("#ansatte > div");
    let totalTimer = 0;
  
    ansatteDivs.forEach(ansattDiv => {
      const timer = parseFloat(ansattDiv.querySelector("input[name='timer']").value);
      totalTimer += timer;
    });
  
    if (totalTips > 0 && totalTimer > 0) {
      ansatteDivs.forEach(ansattDiv => {
        const timer = parseFloat(ansattDiv.querySelector("input[name='timer']").value);
        const prosent = (timer / totalTimer) * 100;
        const beløp = (prosent * totalTips) / 100;
        const resultatSpan = ansattDiv.querySelector('.resultat-ansatt');
        resultatSpan.innerHTML = `
          ${beløp.toFixed(2)} kr
          <div class="prosent-bar-container">
            <div class="prosent-bar" style="width:${prosent.toFixed(2)}%"></div>
          </div>
        `;
      });
    } else {
      ansatteDivs.forEach(ansattDiv => {
        const resultatSpan = ansattDiv.querySelector('.resultat-ansatt');
        resultatSpan.innerHTML = '';
      });
    }
  }
  
  window.onload = function () {
    // Sjekker localstorage for tidligere lagrede navn
    const lagredeAnsatte = JSON.parse(localStorage.getItem('ansatte')) || [];
  
    // Oppretter ansatt-divs for lagrede navn, dersom ingen navn finnes opprettes det en tom div
    if (lagredeAnsatte.length === 0) {
      leggTilAnsatt();
    } else {
      lagredeAnsatte.forEach(navn => leggTilAnsatt(navn));
    }
  
    // Initialiserer den første "Fjern ansatt"-knappen
    oppdaterFjernAnsattKnapper();
  
    // Tømmer totalt tipsfelt ved last inn
    document.getElementById("totalTips").value = '';
  
  }
  