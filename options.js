document.querySelector('#ing').style.display='none';

chrome.storage.local.get('socks5switch', s => {
    s = s.socks5switch || 'on';
    if(s == "on"){
        document.querySelector('#socks5switch').checked = true;
    }
    if(s == "off"){
        document.querySelector('#socks5switch').checked = false;
    }
});
chrome.storage.local.get('socks5server', s => {
    s = s.socks5server || '';
    document.querySelector('#socks5server').value = s;
});

document.querySelector('#save').addEventListener("click", async (e) => {
    document.querySelector('#save').style.display = 'none';
    document.querySelector('#ing').style.display = 'block';

    var socks5switch = document.querySelector('#socks5switch').checked;
    var socks5server = document.querySelector('#socks5server').value;

    if(socks5switch){
        if(!/.+:\d+/.test(socks5server)){
            alert("Invalid socks5 proxy address");
            document.querySelector('#save').style.display = 'block';
            document.querySelector('#ing').style.display = 'none';
            return;
        }
    }
    chrome.storage.local.set({"socks5switch": socks5switch ? 'on' : 'off'});
    chrome.storage.local.set({"socks5server": socks5server});
    var l = [
		"10.0.0.0/8",
		"127.0.0.0/8",
		"169.254.0.0/16",
		"172.16.0.0/12",
		"192.168.0.0/16",
		"224.0.0.0/4",
        "<local>",
        "<localhost>",
        "*.local",
	];

    var host = socks5server.substring(0, socks5server.lastIndexOf(':')).replace('[', '').replace(']', '');
    var port = socks5server.substring(socks5server.lastIndexOf(':')+1);

    chrome.proxy.settings.set({
        value: {
            mode: "fixed_servers",
            rules: {
                singleProxy: {
                    scheme: "socks5",
                    host: host,
                    port: parseInt(port),
                },
                bypassList: l,
            },
        },
    },()=>{
        setTimeout(()=>{
            document.querySelector('#save').style.display = 'block';
            document.querySelector('#ing').style.display = 'none';
        }, 1000);
    });
});
