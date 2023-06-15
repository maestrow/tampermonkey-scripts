// ==UserScript==
// @name         Custom Clone Command
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
  'use strict';
  function injectIf() {
      //console.log('Tempermonkey: Custom Clone Command');
      if (/^https?:\/\/github.com\/[^/]+\/[^/]+\/?$/.test (location.href)) {
          tryInject();
      }
  }
  var handle;
  function clearHandler(){
      clearInterval(handle);
      handle = 0;
  }
  function tryInject() {
      handle = setInterval(inject, 100);
  }
  function inject() {
      const tabpanel = document.querySelector('.Layout-main get-repo div[role=tabpanel]:nth-child(3)')
      //console.log(tabpanel);
      if (!tabpanel) {
          return;
      }
      clearHandler()

      const ig = tabpanel.querySelector('.input-group')
      const p = tabpanel.querySelector('p')
      const ssh = ig.children[0].value;
      const user = ssh.match(/:(.+)\//)[1]
      const repo = ssh.match(/\/(.+).git$/)[1]
      const commandText = `cd /z/repos/github.com && mkdir -p ${user} && cd ${user} && git clone ${ssh} && cd ${repo}`;
      const ig2 = ig.cloneNode(true)
      ig2.children[0].setAttribute('value', commandText)
      ig2.querySelector('clipboard-copy').setAttribute('value', commandText)
      tabpanel.insertBefore(ig2, p)
      ig.style['marginBottom'] = '10px';
      //console.log(commandText);
  }

  let lastUrl = location.href;
  new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
          lastUrl = url;
          onUrlChange();
      }
  }).observe(document, {subtree: true, childList: true});

  function onUrlChange() {
      //console.log('onUrlChange', location.href);
      clearHandler();
      injectIf();
  }

  window.addEventListener('load', function() {
      //console.log('load');
      clearHandler();
      injectIf();
  }, false);
})();
