import tkinter as tk

root = tk.Tk()

def copy_text():
    root.title("Hello World App")
    
    try:
        # Get the selected text and copy it to the clipboard
        selected_text = text_widget.selection_get()
        root.clipboard_clear()  # Clear the clipboard
        root.clipboard_append(selected_text)  # Append selected text to the clipboard
        print("Copied:", selected_text)  # Optional: Print to console for confirmation
    except tk.TclError:
        print("No text selected.")

def paste_text():
    # Get the text from the clipboard and insert it at the cursor position
    try:
        clipboard_text = root.clipboard_get()
        text_widget.insert(tk.INSERT, clipboard_text)
    except tk.TclError:
        print("Clipboard is empty.")

def create_window_cp():
    global text_widget
    root = tk.Tk()
    root.title("Copy-Paste Example")

    text_widget = tk.Text(root, wrap=tk.WORD, height=10, width=50)
    text_widget.pack(pady=10)

    # Create buttons for copy and paste
    copy_button = tk.Button(root, text="Copy", command=copy_text)
    copy_button.pack(side=tk.LEFT, padx=5)

    paste_button = tk.Button(root, text="Paste", command=paste_text)
    paste_button.pack(side=tk.LEFT, padx=5)

    root.mainloop() 

def create_window():
    root = tk.Tk()
    root.title('Trial Window')

    label = tk.Label(root, text="Hello, World!", font=("Arial", 24))
    label.pack(pady=20)

    return root