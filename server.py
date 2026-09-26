#!/usr/bin/env python3
"""
Cyber Clash: Stone Paper Scissors - Python Web Server
Zero-dependency local server using Python's built-in standard library.

Usage:
    python server.py
"""

import http.server
import socketserver
import webbrowser
import os
import json
import random

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class GameRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        # Optional Python API endpoint matching main.py logic
        if self.path == "/api/play":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                my_choice = data.get("choice", "").capitalize()
                
                D = {"Stone": 1, "Paper": 0, "Scissor": -1}
                Reverse = {1: "Stone", 0: "Paper", -1: "Scissor"}

                if my_choice not in D:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Invalid Choice!"}).encode())
                    return

                choice = D[my_choice]
                computer = random.choice([-1, 0, 1])

                # Match logic from main.py
                result = ""
                if computer == choice:
                    result = "Draw"
                elif (computer == 1 and choice == 0) or \
                     (computer == 0 and choice == -1) or \
                     (computer == -1 and choice == 1):
                    result = "Win"
                else:
                    result = "Lose"

                response = {
                    "playerChoice": my_choice,
                    "playerVal": choice,
                    "computerChoice": Reverse[computer],
                    "computerVal": computer,
                    "result": result
                }

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())

            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self.send_error(404, "Endpoint not found")

def run():
    handler = GameRequestHandler
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print("⚡ CYBER CLASH // STONE PAPER SCISSORS GAME SERVER ⚡")
        print(f"🚀 Serving at: {url}")
        print("📁 Directory:", DIRECTORY)
        print("⌨️  Press Ctrl+C to stop the server.")
        print("=" * 60)
        
        # Open in default web browser
        try:
            webbrowser.open(url)
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Goodbye!")

if __name__ == "__main__":
    run()
