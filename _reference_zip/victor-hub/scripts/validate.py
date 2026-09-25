#!/usr/bin/env python3
"""Porta de validação do Victor Hub AI.

Rode na raiz do projeto, ou de qualquer pasta:

    python3 scripts/validate.py

Termina com VALIDATION PASS ou VALIDATION FAIL.
Não sobe o servidor na porta 8080, para não derrubar um preview já aberto.
"""

import json
import os
import shutil
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FAIL = []

REQUIRED = [
    "index.html",
    "sistema.html",
    "server.py",
    "js/config.js",
    "js/data.js",
    "js/store.js",
    "js/os.js",
    "js/site.js",
    "css/site.css",
    "css/system.css",
    "docs/AGENTE.md",
    "docs/DADOS.md",
    "_redirects",
    "vercel.json",
    "README.md",
]

FORBIDDEN = ("nortech", "nogueira", "agência gringa", "agencia gringa", "tempo recorde")
SCAN = ("index.html", "sistema.html", "js", "css")


def fail(msg):
    FAIL.append(msg)


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def walk_text(rel):
    path = ROOT / rel
    if path.is_file():
        yield rel, read(rel)
        return
    for dirpath, _, files in os.walk(path):
        for name in files:
            if name.endswith((".js", ".css", ".html")):
                full = Path(dirpath) / name
                rel_path = full.relative_to(ROOT).as_posix()
                yield rel_path, full.read_text(encoding="utf-8")


def free_port():
    sock = socket.socket()
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
    sock.close()
    return port


def main():
    os.chdir(ROOT)
    for rel in REQUIRED:
        if not (ROOT / rel).is_file():
            fail("arquivo ausente: " + rel)

    for rel, text in list(walk_text("index.html")) + list(walk_text("sistema.html")) + list(walk_text("js")) + list(walk_text("css")):
        low = text.lower()
        for bad in FORBIDDEN:
            if bad in low:
                fail("afirmação proibida em %s: %s" % (rel, bad))

    cfg = read("js/config.js") if (ROOT / "js/config.js").is_file() else ""
    for key in ("storageKey", "dataMode", "apiBase", "publicOrigin", "whatsapp"):
        if key not in cfg:
            fail("js/config.js sem " + key)
    if "victor-hub-os-v1" not in cfg:
        fail("storageKey saiu de victor-hub-os-v1 sem migração")
    if 'dataMode: "local"' not in cfg:
        fail('dataMode não é "local" — o adaptador de API ainda não existe')
    if "5516982141822" not in cfg:
        fail("WhatsApp de referência saiu de js/config.js")

    html = read("index.html") if (ROOT / "index.html").is_file() else ""
    if "data-wa=" not in html:
        fail("a home não marca os links de WhatsApp com data-wa")
    if "js/config.js" not in html:
        fail("index.html não carrega js/config.js")
    sistema = read("sistema.html") if (ROOT / "sistema.html").is_file() else ""
    if "js/config.js" not in sistema:
        fail("sistema.html não carrega js/config.js")
    if sistema.find("js/config.js") > sistema.find("js/store.js"):
        fail("config.js precisa vir antes de store.js")

    osjs = read("js/os.js") if (ROOT / "js/os.js").is_file() else ""
    if osjs.count("boot();\n})();") != 1:
        fail("js/os.js precisa fechar o IIFE uma única vez")

    node = shutil.which("node")
    if node:
        for rel in ("js/config.js", "js/data.js", "js/store.js", "js/os.js", "js/site.js"):
            proc = subprocess.run([node, "--check", rel], cwd=ROOT, capture_output=True, text=True)
            if proc.returncode != 0:
                fail("sintaxe %s: %s" % (rel, (proc.stderr or proc.stdout).strip()))
    else:
        print("AVISO: node ausente, sintaxe JS não checada")

    port = free_port()
    env = os.environ.copy()
    env["PORT"] = str(port)
    proc = subprocess.Popen(
        [sys.executable, "server.py"],
        cwd=ROOT,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    try:
        ready = False
        for _ in range(40):
            if proc.poll() is not None:
                out = proc.stdout.read() if proc.stdout else ""
                fail("server.py encerrou: " + out[-400:])
                break
            try:
                with urllib.request.urlopen("http://127.0.0.1:%s/health" % port, timeout=1) as res:
                    body = json.loads(res.read().decode())
                    ready = True
                    if not body.get("ok"):
                        fail("/health sem ok")
                    if body.get("dataMode") != "local":
                        fail("/health dataMode inesperado")
                    if body.get("storageKey") != "victor-hub-os-v1":
                        fail("/health storageKey inesperado")
                break
            except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
                time.sleep(0.15)
        if not ready and proc.poll() is None:
            fail("servidor não respondeu /health")
        if ready:
            for path in ("/", "/sistema", "/sistema/projetos", "/sistema/configuracoes"):
                try:
                    with urllib.request.urlopen("http://127.0.0.1:%s%s" % (port, path), timeout=3) as res:
                        page = res.read().decode("utf-8", "replace")
                        if res.status != 200:
                            fail("%s status %s" % (path, res.status))
                        if path != "/" and "js/os.js" not in page:
                            fail("%s não entregou o sistema" % path)
                        if path == "/" and "Nogueira" in page:
                            fail("home ainda cita Nogueira")
                except urllib.error.URLError as err:
                    fail("%s falhou: %s" % (path, err))
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            proc.kill()

    if FAIL:
        print("VALIDATION FAIL")
        for item in FAIL:
            print("- " + item)
        return 1
    print("VALIDATION PASS")
    print("dataMode: local")
    print("storageKey: victor-hub-os-v1")
    print("publicOrigin: vazio — o domínio ainda é do dono")
    print("routes: / /sistema /sistema/projetos /sistema/configuracoes /health")
    return 0


if __name__ == "__main__":
    sys.exit(main())
