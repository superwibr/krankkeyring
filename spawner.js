(async x => {
    // window size math
    const winw = window.screen.width / 5,
        winh = window.screen.height / 4,
        winx = (window.screen.width - winw),
        winy = winh;

    // summon window
    const win = window.open("https://superwibr.github.io/krankkeyrig/keyring.html", "krankkeyring", `width=${winw},height=${winh},left=${winx},top=${winy}`)
    console.log(win);
})();