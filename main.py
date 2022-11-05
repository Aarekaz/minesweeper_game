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