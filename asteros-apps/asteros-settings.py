#!/usr/bin/env python3
"""AsterOS native customization frontend for the underlying Xfce session."""
import subprocess
import tkinter as tk
from tkinter import ttk, messagebox


def set_setting(channel, key, value):
    result = subprocess.run(['xfconf-query', '-c', channel, '-p', key, '-s', value], capture_output=True, text=True)
    if result.returncode:
        messagebox.showerror('Settings', result.stderr.strip() or 'Failed to update setting.')


root = tk.Tk()
root.title('AsterOS Settings')
root.geometry('620x420')
root.configure(bg='#101729')
frm = ttk.Frame(root, padding=24)
frm.pack(fill='both', expand=True)
ttk.Label(frm, text='AsterOS Settings', font=('Sans', 20, 'bold')).pack(anchor='w', pady=(0, 8))
ttk.Label(frm, text='Customize the real desktop environment. Changes apply to Xfce.').pack(anchor='w', pady=(0, 24))
ttk.Label(frm, text='Appearance').pack(anchor='w')
ttk.Button(frm, text='Dark theme', command=lambda: set_setting('xsettings', '/Net/ThemeName', 'Adwaita-dark')).pack(anchor='w', pady=4)
ttk.Button(frm, text='Light theme', command=lambda: set_setting('xsettings', '/Net/ThemeName', 'Adwaita')).pack(anchor='w', pady=4)
ttk.Separator(frm).pack(fill='x', pady=16)
ttk.Label(frm, text='System tools').pack(anchor='w')
for title, cmd in [('Display settings', 'xfce4-display-settings'), ('Appearance settings', 'xfce4-appearance-settings'), ('Keyboard settings', 'xfce4-keyboard-settings'), ('All settings', 'xfce4-settings-manager')]:
    ttk.Button(frm, text=title, command=lambda c=cmd: subprocess.Popen([c])).pack(anchor='w', pady=3)
root.mainloop()
