#!/usr/bin/env python3
"""Victor Hub AI — servidor local do site e do Production OS."""

import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = int(os.environ.get("PORT", "8080"))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/health":
            body = (
                '{"ok":true,"name":"Victor Hub AI","dataMode":"local",'
                '"storageKey":"victor-hub-os-v1"}\n'
            ).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if path == "/sistema" or path.startswith("/sistema/"):
            self.path = "/sistema.html" + (("?" + self.path.split("?", 1)[1]) if "?" in self.path else "")
        elif path == "/":
            self.path = "/index.html"
        return super().do_GET()

    def list_directory(self, path):
        self.send_error(404, "Not found")
        return None

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Victor Hub AI em http://0.0.0.0:{PORT}", flush=True)
    server.serve_forever()
