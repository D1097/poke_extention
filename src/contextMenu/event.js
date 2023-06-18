{
  chrome.runtime.onInstalled.addListener(() => {
    const parent = chrome.contextMenus.create({
      id: 'grandParent',
      title: 'PokeExtention',
    })
    chrome.contextMenus.create({
      id: 'StalkerMode',
      parentId: 'grandParent',
      title: 'StalkerMode',
    })
    chrome.contextMenus.create({
      id: 'FixedMode',
      parentId: 'grandParent',
      title: 'FixedMode',
    })
  })

  // メニューをクリック時に実行
  chrome.contextMenus.onClicked.addListener(async (item, tab) => {
    console.log('current mode', await chrome.storage.local.get())
    // モードを保存
    console.log(tab)
    console.log(chrome.activeTab)
    chrome.storage.local.set({ mode: item.menuItemId });
    chrome.tabs.sendMessage(tab.id, { mode: item.menuItemId })

  })
}
