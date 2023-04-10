const
    keyInput = document.querySelector("#keyinput"),
    eatForm = document.querySelector("#eat"),
    topicField = document.querySelector("#topic"),
    output = document.querySelector("pre"),
    clear = document.querySelector("#clear")
params = [{ name: "AES-CTR", length: 128 }, true, ['encrypt', 'decrypt']];

const downloadFile = async (data, filename) => Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([data])), download: filename }).click();

const
    newKey = () => crypto.subtle.generateKey(...params),
    getStorageKey = () => crypto.subtle.importKey("jwk", JSON.parse(localStorage.aesKey), ...params),
    putStorageKey = async key => localStorage.aesKey = JSON.stringify(await crypto.subtle.exportKey("jwk", key)),
    getFileKey = async file => await crypto.subtle.importKey("raw", await file.arrayBuffer(), ...params),
    putFileKey = async key => downloadFile(
        await crypto.subtle.exportKey("raw", key),
        "yourkey.key.bin"
    );

const
    createKey = async () => {
        const key = await newKey();
        await putStorageKey(key);
        await putFileKey(key);
        return key;
    },
    fetchKey = async () => (
        keyInput.files[0] ? await putStorageKey(await getFileKey(keyInput.files[0])) : 0,
        localStorage.aesKey ? await getStorageKey() :
            await createKey()
    ),
    eat = async topic => {
        const key = await fetchKey();
        const crypt = await crypto.subtle.encrypt(
            {
                name: "AES-CTR",
                counter: new Uint8Array([140, 4, 126, 36, 153, 3, 1, 214, 179, 197, 198, 167, 126, 170, 245, 119]),
                length: 64
            },
            key,
            new TextEncoder().encode(topic)
        );
        const digest = await crypto.subtle.digest("SHA-256", crypt);
        return new TextDecoder().decode(digest);
    }

// rigging
eatForm.addEventListener("submit", async e => (
    eat(topicField.value).then(out => (
        output.innerText = out,
        navigator.clipboard.writeText(out)
    )),
    e.preventDefault()
));
clear.onclick = () => (delete localStorage.aesKey, location.reload());