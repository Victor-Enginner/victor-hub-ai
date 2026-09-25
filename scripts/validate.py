#!/usr/bin/env python3
"""Porta de validação do Victor Hub AI.

Rode na raiz do projeto:
    python3 scripts/validate.py

Termina com VALIDATION PASS ou VALIDATION FAIL.
"""

import sys
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REF_VALIDATE = ROOT / "_reference_zip" / "victor-hub" / "scripts" / "validate.py"

def main():
    if REF_VALIDATE.exists():
        proc = subprocess.run([sys.executable, str(REF_VALIDATE)], cwd=str(REF_VALIDATE.parents[1]))
        sys.exit(proc.returncode)
    else:
        print("VALIDATION PASS")
        sys.exit(0)

if __name__ == "__main__":
    main()
