#!/usr/bin/env python3
"""Read-only Security Center; reports actual firewall, updates, and security state."""
import subprocess
import tkinter as tk
from tkinter import ttk


def run(args):
    try:
        p = subprocess.run(args, capture_output=True, text=True, timeout=8)
        return (p.stdout or p.stderr or 'No output').strip()
    except (OSError, subprocess.TimeoutExpired) as e:
        return str(e)


root = tk.Tk()
root.title('AsterOS Security Center')
root.geometry('750x530')
frame = ttk.Frame(root, padding=18)
frame.pack(fill='both', expand=True)
ttk.Label(frame, text='AsterOS Security Center', font=('Sans', 20, 'bold')).pack(anchor='w')
ttk.Label(frame, text='Live system checks — not Microsoft Defender or an antivirus scanner.').pack(anchor='w', pady=(4, 12))
view = tk.Text(frame, height=20, wrap='word')
view.pack(fill='both', expand=True)


def refresh():
    checks = [
        ('Kernel', ['uname', '-sr']),
        ('Firewall (UFW)', ['ufw', 'status']),
        ('NetworkManager', ['systemctl', 'is-active', 'NetworkManager']),
        ('Open TCP/UDP listeners', ['ss', '-lntu']),
        ('Root user status', ['passwd', '-S', 'root']),
    ]
    lines = []
    for label, cmd in checks:
        lines.extend([f'== {label} ==', run(cmd), ''])
    lines += ['This dashboard does not scan files for malware.',
              'UFW may require administrative privileges to inspect or configure.',
              'A green or active status is not a guarantee of safety.']
    view.config(state='normal')
    view.delete('1.0', 'end')
    view.insert('1.0', '\n'.join(lines))
    view.config(state='disabled')

ttk.Button(frame, text='Refresh checks', command=refresh).pack(anchor='w', pady=8)
refresh()
root.mainloop()
