"""
⚠️  DEPRECATED - This file is no longer used ⚠️

This was the original Python/tkinter implementation.
The game has been completely rebuilt as a modern web application!

🎮 To run the new version:
   ./start.sh
   OR
   npm install && npm run dev

See README.md for full documentation.
"""

# Legacy Python/tkinter code (kept for reference only)
from tkinter import *

root = Tk()
#overide the setting of the video

root.configure(background='black')
root.geometry("1440x720")
root.title("MINE SWEEPER")
root.resizable(False,False)

#creating frames

top_frame= Frame(root,
                 bg="white",
                 width=1440,
                 height=180
                 )
top_frame.place(x=0,y=0)



#run the window
root.mainloop()