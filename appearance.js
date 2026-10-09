/* Local theme preference shared with the practice panel. No network requests. */
(() => {
  'use strict';
  const api=globalThis.browser || globalThis.chrome;
  const key='mt:preferences',select=document.querySelector('[data-theme-select]');
  const scheme=globalThis.matchMedia('(prefers-color-scheme: dark)');
  let theme='system',epoch=0;
  function apply() {
    document.documentElement.dataset.theme=theme==='system'?(scheme.matches?'dark':'light'):theme;
    if(select)select.value=theme;
  }
  function read(value) { theme=['light','dark','system'].includes(value?.theme)?value.theme:'system';apply(); }
  apply();
  scheme.addEventListener('change',()=>{if(theme==='system')apply();});
  if(api?.storage?.local) {
    const loadEpoch=epoch;
    api.storage.local.get(key).then(result=>{if(epoch===loadEpoch)read(result[key]);}).catch(()=>{});
    api.storage.onChanged?.addListener((changes,area)=>{if(area==='local'&&changes[key]){epoch++;read(changes[key].newValue);}});
  }
  select?.addEventListener('change',async()=>{
    epoch++;theme=select.value;apply();
    if(!api?.storage?.local)return;
    try {
      const result=await api.storage.local.get(key);
      await api.storage.local.set({[key]:{...result[key],theme}});
    } catch (_) { select.title='No se pudo guardar el tema.'; }
  });
})();
